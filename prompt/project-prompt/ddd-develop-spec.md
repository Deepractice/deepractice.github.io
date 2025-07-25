## DDD领域开发规范 (基于Scorpio Framework) [scorpio-framework-develop-spec.mdc](mdc:.cursor/rules/scorpio-framework-develop-spec.mdc)

### 0. 项目结构
项目目录结构遵循maven风格。
src/main/java 是项目代码的根目录。
src/main/resources 是项目资源文件的根目录。
src/test/java 是项目测试代码的根目录。
src/test/resources 是项目测试资源文件的根目录。
#### 0.1 根包
根包是是最顶层的package，包命名规范为: `com.{组织名}.{项目名}`
项目信息章节会明确根包。

### 1. 领域层开发规范

#### 1.1 包结构规范
领域的包名是domain， 是根包的子目录。
domain包下按照领域模型来划分模块， 每个领域模型一个包。
领域模型的包下必须包含以下目录:
```
domain.{module}
├── aggregate          # 聚合根
├── entity            # 实体
├── valueobject       # 值对象
├── repository        # 仓储接口
├── service           # 领域服务
├── event            # 领域事件
├── validator         # 验证器
└── trouble          # 异常定义
```

#### 1.2 聚合根（Aggregate Root）规范

1. **基本要求**
   - 必须实现 `Congestive` 接口
   - 必须继承 `BaseEntity`
   - 必须使用 `@CongestiveId` 定义业务标识
   - 必须定义对应的 `Repository`
   - 必须定义对应的 `Validator`
   - 必须放在 aggregate 包下
   - 必须通过工厂方法创建实例
   - 禁止使用 @Getter 和 @Setter 注解
   - 所有属性访问方法必须显式定义

2. **命名规范**
```java
User                     // 聚合根类名
UserRepository           // 仓储接口名
UserValidator            // 验证器名
```

3. **代码规范**
```java
@Entity
@Table(name = "ppi_user")
public class User extends BaseEntity implements Congestive<User, UserRepository> {
    
    @CongestiveId(generator = SnowflakeGenerator.class)
    private String userId;
    
    @NotBlank(message = "用户名不能为空")
    private String username;
    
    @Enumerated(EnumType.STRING)
    private UserStatus status;
    
    // 值对象
    @Embedded
    private Address address;
    
    // 实体集合
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "user_id")
    private List<ContactInfo> contactInfos = new ArrayList<>();
    
    // protected 构造函数，供JPA使用
    protected User() {}
    
    // 工厂方法
    public static User create(String username, Address address) {
        User user = new User();
        user.username = username;
        user.address = address;
        user.status = UserStatus.INACTIVE;
        user.contactInfos = new ArrayList<>();
        
        log.info("Created new user with username [{}]", username);
        return user;
    }
    
    // 显式定义必要的getter方法
    public String getUserId() {
        return userId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public UserStatus getStatus() {
        return status;
    }
    
    public Address getAddress() {
        return address;
    }
    
    public List<ContactInfo> getContactInfos() {
        return Collections.unmodifiableList(contactInfos);
    }
    
    // 业务方法
    public void activate() {
        if (status != UserStatus.INACTIVE) {
            throw UserTrouble.INVALID_STATUS_TRANSITION.thrown();
        }
        status = UserStatus.ACTIVE;
        log.info("User [{}] activated", userId);
    }
    
    public void addContactInfo(ContactInfo contactInfo) {
        contactInfos.add(contactInfo);
        log.info("Added contact info for user [{}]", userId);
    }
    
    public void changeAddress(Address newAddress) {
        this.address = newAddress;
        log.info("Changed address for user [{}]", userId);
    }
}
```

#### 1.3 实体（Entity）规范

1. **基本要求**
   - 必须继承 `BaseEntity`
   - 必须放在 entity 包下
   - 不允许被外部直接访问
   - 必须通过聚合根进行访问和修改
   - 禁止使用 @Getter 和 @Setter 注解
   - 所有属性访问方法必须显式定义

2. **代码规范**
```java
@Entity
@Table(name = "contact_info")
public class ContactInfo extends BaseEntity {
    
    @NotBlank
    private String type;
    
    @NotBlank
    private String value;
    
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;
    
    // protected 构造函数，供JPA使用
    protected ContactInfo() {}
    
    // 工厂方法
    public static ContactInfo create(String type, String value) {
        ContactInfo contactInfo = new ContactInfo();
        contactInfo.type = type;
        contactInfo.value = value;
        contactInfo.validate();
        return contactInfo;
    }
    
    // 显式定义getter方法
    public String getType() {
        return type;
    }
    
    public String getValue() {
        return value;
    }
    
    // 实体的业务方法
    public void validate() {
        if ("phone".equals(type) && !value.matches("^1[3-9]\\d{9}$")) {
            throw new IllegalArgumentException("Invalid phone number");
        }
    }
}
```

#### 1.4 值对象（Value Object）规范

1. **基本要求**
   - 必须是不可变的（所有字段都是final）
   - 必须重写 equals() 和 hashCode() 方法
   - 必须放在 valueobject 包下
   - 推荐使用 @Value 注解（Lombok）

2. **代码规范**
```java
@Value
@Embeddable
public class Address {
    String province;
    String city;
    String district;
    String detail;
    
    // 工厂方法创建值对象
    public static Address of(String province, String city, String district, String detail) {
        return new Address(province, city, district, detail);
    }
    
    // 值对象的业务方法返回新实例
    public Address changeDetail(String newDetail) {
        return new Address(this.province, this.city, this.district, newDetail);
    }
}
```

#### 1.5 领域事件（Domain Event）规范

1. **基本要求**
   - 必须放在 event 包下
   - 事件类名以 Event 结尾
   - 事件必须是不可变的
   - 包含事件发生时间和相关数据

2. **代码规范**
```java
@Value
public class UserCreatedEvent {
    String userId;
    String username;
    LocalDateTime occurredTime;
    
    public static UserCreatedEvent of(User user) {
        return new UserCreatedEvent(
            user.getUserId(),
            user.getUsername(),
            LocalDateTime.now()
        );
    }
}
```

#### 1.6 领域异常（Domain Exception）规范

1. **基本要求**
   - 必须放在 trouble 包下
   - 使用 TroubleEnum 定义异常
   - 异常码要有明确的业务含义

2. **代码规范**
```java
@TroublePrefix("USER")
public enum UserTrouble implements TroubleEnum {
    
    @Trouble(
        code = "001",
        message = "用户不存在"
    )
    USER_NOT_FOUND,
    
    @Trouble(
        code = "002",
        message = "用户名已被使用",
        status = HttpStatus.CONFLICT
    )
    USERNAME_ALREADY_EXISTS,
    
    @Trouble(
        code = "003",
        message = "无效的状态转换"
    )
    INVALID_STATUS_TRANSITION
}
```

#### 1.7 验证器（Validator）规范

1. **基本要求**
   - 必须实现 CongestiveValidator 接口
   - 必须使用 @Component 注解
   - 验证方法必须显式声明 throws CongestiveNotValidException
   - 验证失败必须抛出 CongestiveNotValidException

2. **代码规范**
```java
@Component
public class UserValidator implements CongestiveValidator<User> {
    
    @Override
    public void validateSave(User user) throws CongestiveNotValidException {
        // 验证用户名唯一性
        user.repository().findByAttribute("username", user.getUsername())
            .filter(t -> !t.getUserId().equals(user.getUserId()))
            .ifPresent(t -> {
                throw new CongestiveNotValidException("用户名已存在");
            });
            
        // 验证联系方式
        if (user.getContactInfos().isEmpty()) {
            throw new CongestiveNotValidException("至少需要一个联系方式");
        }
    }
    
    @Override
    public void validateDelete(User user) throws CongestiveNotValidException {
        if (user.getStatus() == UserStatus.ACTIVE) {
            throw new CongestiveNotValidException("活跃用户不能删除");
        }
    }
}
```

#### 1.8 仓储接口（Repository）规范

1. **基本要求**
   - 必须继承 CongestiveRepository
   - 必须使用 @Repository 注解
   - 优先使用框架提供的通用方法

2. **代码规范**
```java
@Repository
public interface UserRepository extends CongestiveRepository<User> {
    
    // 使用框架提供的通用方法
    default Optional<User> findByUsername(String username) {
        return findByAttribute("username", username);
    }
    
    // 自定义复杂查询
    @Query("SELECT u FROM User u " +
           "LEFT JOIN FETCH u.contactInfos " +
           "WHERE u.status = :status")
    List<User> findActiveUsersWithContacts(@Param("status") UserStatus status);
}
```

#### 1.9 最佳实践

1. **聚合设计**
   - 保持聚合尽可能小
   - 通过业务边界识别聚合
   - 避免跨聚合的实时一致性

2. **实体设计**
   - 实体应该是充血模型
   - 避免公共setter
   - 通过方法表达业务含义

3. **值对象设计**
   - 优先使用值对象
   - 确保不可变性
   - 通过方法返回新实例

4. **仓储设计**
   - 优先使用框架提供的通用方法
   - 复杂查询考虑使用QueryService
   - 避免在仓储中包含业务逻辑

5. **异常处理**
   - 使用领域异常表达业务规则
   - 异常信息应该对用户友好
   - 合理使用HTTP状态码

### 2. 应用层开发规范

#### 2.1 包结构规范
应用层的包名是application， 是根包的子目录。
应用层的包下按照应用模型来划分模块， 每个应用模型一个包。
应用模型的包下必须包含以下目录:
```
application.{module}
├── controller        # 控制器
├── service          # 应用服务
│   └── impl        # 应用服务实现
├── criteria         # 查询条件
├── request          # 请求对象
├── result           # 结果对象
└── assembler        # 对象转换器
```

#### 2.2 控制器（Controller）规范

1. **基本要求**
   - 必须使用 @RestController 注解
   - 必须使用 @RequestMapping 定义基础路径
   - 路径命名必须使用连字符（kebab-case）
   - 返回结构必须使用 Scorpio 的 RestResult 统一返回格式 
   - 必须使用 SpringDoc 注解完整描述 API 文档
   - 类和方法必须有清晰的注释

2. **SpringDoc 注解规范**
   - 类上必须使用 @Tag 注解标注模块名称
   - 方法上必须使用 @Operation 注解描述接口功能
   - 请求参数必须使用 @Parameter 注解描述参数含义
   - 分页参数必须使用 @PageableAsQueryParam 注解描述

3. **代码规范**
```java
@Tag(name = "用户管理", description = "用户相关的 API 接口")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserApplicationService userService;
    private final UserQueryService userQueryService;
    
    @Operation(summary = "创建用户",
        description = "创建一个新的用户，包括基本信息和联系方式")
    @PostMapping
    public ResponseEntity<UserResult> createUser(
        @RequestBody @Valid CreateUserRequest request
    ) {
        UserResult result = userService.createUser(request);
        return RestResult.ok(result);
    }
    
    @Operation(summary = "获取用户详情",
        description = "根据用户ID获取用户的详细信息")
    @GetMapping("/{userId}")
    public ResponseEntity<UserResult> getUser(
        @Parameter(description = "用户ID", example = "USER_123456")
        @PathVariable String userId
    ) {
        UserResult result = userService.getUser(userId);
        return RestResult.ok(result);
    }
    
    @Operation(summary = "查询用户列表",
        description = "根据条件分页查询用户列表")
    @PageableAsQueryParam
    @GetMapping
    public ResponseEntity<List<UserResult>> queryUsers(
        @Parameter(description = "查询条件")
        UserCriteria criteria,
        
        @Parameter(hidden = true)
        Pageable pageable
    ) {
        Page<UserResult> page = userQueryService.queryUsers(criteria, pageable);
        return RestResult.ok(page);
    }
    
    @Operation(summary = "更新用户状态",
        description = "更新指定用户的状态")
    @PutMapping("/{userId}/status")
    public ResponseEntity<UserResult> updateUserStatus(
        @Parameter(description = "用户ID", example = "USER_123456")
        @PathVariable String userId,
        
        @RequestBody @Valid UpdateUserStatusRequest request
    ) {
        UserResult result = userService.updateUserStatus(userId, request);
        return RestResult.ok(result);
    }
    
    @Operation(summary = "删除用户",
        description = "删除指定的用户")
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(
        @Parameter(description = "用户ID", example = "USER_123456")
        @PathVariable String userId
    ) {
        userService.deleteUser(userId);
        return RestResult.noContent();
    }
}
```

4. **请求对象的文档注解**
```java
@Schema(description = "创建用户请求")
@Data
public class CreateUserRequest implements Serializable {
    
    @Schema(description = "用户名", example = "zhangsan")
    @NotBlank(message = "用户名不能为空")
    @Size(min = 2, max = 20, message = "用户名长度必须在2-20之间")
    private String username;
    
    @Schema(description = "省份", example = "浙江省")
    @NotBlank(message = "省份不能为空")
    private String province;
    
    @Schema(description = "城市", example = "杭州市")
    @NotBlank(message = "城市不能为空")
    private String city;
    
    @Schema(description = "区县", example = "西湖区")
    @NotBlank(message = "区县不能为空")
    private String district;
    
    @Schema(description = "详细地址", example = "文一西路998号")
    @NotBlank(message = "详细地址不能为空")
    private String detail;
    
    @Schema(description = "联系方式列表")
    @NotEmpty(message = "至少需要一个联系方式")
    private List<ContactInfoRequest> contactInfos;
}
```

5. **结果对象的文档注解**
```java
@Schema(description = "用户信息结果")
@Data
public class UserResult implements Serializable {
    @Schema(description = "用户ID", example = "USER_123456")
    private String userId;
    
    @Schema(description = "用户名", example = "zhangsan")
    private String username;
    
    @Schema(description = "用户状态", example = "ACTIVE")
    private UserStatus status;
    
    @Schema(description = "地址信息")
    private AddressResult address;
    
    @Schema(description = "联系方式列表")
    private List<ContactInfoResult> contactInfos;
    
    @Schema(description = "创建时间", example = "2024-01-01T12:00:00")
    private LocalDateTime createdTime;
    
    @Schema(description = "更新时间", example = "2024-01-01T12:00:00")
    private LocalDateTime updatedTime;
}
```

#### 2.3 应用服务（Application Service）规范

1. **基本要求**
   - 接口必须以 ApplicationService 结尾
   - 实现类必须放在 impl 包下
   - 实现类必须使用 @Service 注解
   - 必须使用构造器注入依赖
   - 必须添加事务注解

2. **代码规范**
```java
public interface UserApplicationService {
    UserResult createUser(CreateUserRequest request);
    UserResult getUser(String userId);
    UserResult updateUserStatus(String userId, UpdateUserStatusRequest request);
    void deleteUser(String userId);
}

@Service
@RequiredArgsConstructor
public class UserApplicationServiceImpl implements UserApplicationService {
    
    private final UserAssembler assembler;
    
    @Transactional
    @Override
    public UserResult createUser(CreateUserRequest request) {
        // 1. 转换请求对象到领域对象
        Address address = Address.of(
            request.getProvince(),
            request.getCity(),
            request.getDistrict(),
            request.getDetail()
        );
        
        // 2. 调用领域服务或聚合根方法
        User user = User.create(request.getUsername(), address);
        
        // 3. 添加联系方式
        request.getContactInfos().forEach(contact -> {
            ContactInfo contactInfo = ContactInfo.create(
                contact.getType(),
                contact.getValue()
            );
            user.addContactInfo(contactInfo);
        });
        
        // 4. 保存并返回结果
        user.save();
        return assembler.toResult(user);
    }
    
    @Transactional(readOnly = true)
    @Override
    public UserResult getUser(String userId) {
        User user = Congestive.get(userId, User.class);
        return assembler.toResult(user);
    }
}
```

#### 2.4 查询服务（Query Service）规范

1. **基本要求**
   - 接口必须以 QueryService 结尾
   - 实现类必须放在 impl 包下
   - 实现类必须使用 @Service 注解
   - 必须使用构造器注入依赖
   - 必须使用 @Transactional(readOnly = true) 注解
   - 方法名必须以 query 开头

2. **代码规范**
```java
public interface UserQueryService {
    Page<UserResult> queryUsers(UserCriteria criteria, Pageable pageable);
    List<UserResult> queryUsersByStatus(UserStatus status);
    Optional<UserResult> queryUserByPhone(String phoneNo);
}

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserQueryServiceImpl implements UserQueryService {
    
    private final QueryExpressionService<User, JpaQueryExpression<User>> queryService;
    private final UserAssembler assembler;
    
    @Override
    public Page<UserResult> queryUsers(UserCriteria criteria, Pageable pageable) {
        Page<User> userPage = queryService.queryPage(criteria, pageable);
        return assembler.toUserResultPage(userPage);
    }
    
    @Override
    public List<UserResult> queryUsersByStatus(UserStatus status) {
        // 使用 Congestive 提供的静态查询方法
        List<User> users = Congestive.findAllByAttribute(
            User_.status,
            status,
            User.class
        );
        return assembler.toUserResults(users);
    }
    
    @Override
    public Optional<UserResult> queryUserByPhone(String phoneNo) {
        // 使用 Congestive 提供的静态查询方法
        return Congestive.findByAttribute(User_.phoneNo, phoneNo, User.class)
            .map(assembler::toUserResult);
    }
}
```

3. **查询方法规范**
   - 简单查询优先使用 Congestive 提供的静态查询方法
   - 复杂查询使用 QueryExpressionService
   - 所有查询方法必须返回 Result 对象，不能返回领域对象
   - 查询条件统一使用 Criteria 对象
   - 支持分页的查询必须使用 Pageable 参数

4. **性能优化规范**
   - 查询必须使用 readOnly 事务
   - 避免 N+1 查询问题
   - 合理使用索引
   - 大数据量查询必须使用分页
   - 需要时使用 @QueryHints 优化查询

5. **代码示例 - 复杂查询**
```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderQueryServiceImpl implements OrderQueryService {
    
    private final QueryExpressionService<Order, JpaQueryExpression<Order>> queryService;
    private final OrderAssembler assembler;
    
    @Override
    @QueryHints(@QueryHint(name = "org.hibernate.readOnly", value = "true"))
    public Page<OrderResult> queryOrders(OrderCriteria criteria, Pageable pageable) {
        // 1. 创建基础查询
        JpaQueryExpression<Order> expression = queryService.createExpression(criteria);
        
        // 2. 添加关联查询
        expression.addJoinFetch("items", JoinType.LEFT);
        expression.addJoinFetch("buyer", JoinType.LEFT);
        
        // 3. 添加额外条件
        if (criteria.getNeedItems()) {
            expression.addPredicate(
                Order_.items.isNotEmpty()
            );
        }
        
        // 4. 执行查询并转换结果
        Page<Order> orderPage = queryService.queryPage(expression, pageable);
        return assembler.toOrderResultPage(orderPage);
    }
    
    @Override
    public List<OrderStatisticsResult> queryOrderStatistics(
        OrderStatisticsCriteria criteria
    ) {
        // 1. 创建统计查询
        JpaQueryExpression<Order> expression = queryService.createExpression(criteria);
        
        // 2. 设置分组和聚合
        expression.addGroupBy(Order_.status);
        expression.addSelection(Order_.status);
        expression.addSelection(
            "count(*)", 
            Long.class, 
            "orderCount"
        );
        expression.addSelection(
            "sum(totalAmount)", 
            BigDecimal.class, 
            "totalAmount"
        );
        
        // 3. 执行查询并转换结果
        List<Tuple> tuples = queryService.queryList(expression, Tuple.class);
        return assembler.toOrderStatisticsResults(tuples);
    }
}
```

6. **最佳实践**
   - 查询服务只负责数据查询，不包含业务逻辑
   - 复杂查询条件应该封装在 Criteria 对象中
   - 统计查询应该使用专门的结果对象
   - 查询方法应该是幂等的
   - 合理使用缓存提升查询性能
   - 大数据量的统计查询考虑使用异步处理
   - 关联查询时注意性能影响

#### 2.5 查询条件（Criteria）规范

1. **基本要求**
   - 类名必须以 Criteria 结尾
   - 必须使用 @Expression 注解定义查询条件
   - 必须实现 Serializable 接口
   - 必须使用 @Data 注解
   - 必须使用Spring Doc 注解对参数进行描述
   - 每一个聚合根对应一个Criteria类
2. **代码规范**
```java
@Data
public class UserCriteria implements Serializable {
    
    @Expression(
        path = @Path("username"),
        operator = Operator.CONTAINS
    )
    private String usernameKeyword;
    
    @Expression(path = @Path("status"))
    private UserStatus status;
    
    @Expression(
        path = @Path(
            attribute = "province",
            embed = @Embed(attribute = "address")
        )
    )
    private String province;
    
    @Expression(
        path = @Path(
            attribute = "city",
            embed = @Embed(attribute = "address")
        )
    )
    private String city;
}
```

#### 2.6 请求对象（Request）规范

1. **基本要求**
   - 类名必须以 Request 结尾
   - 必须使用 validation 注解进行参数校验
   - 必须实现 Serializable 接口
   - 必须使用 @Data 注解
   - 必须使用 Spring Doc 注解对参数进行描述

2. **代码规范**
```java
@Data
public class CreateUserRequest implements Serializable {
    
    @NotBlank(message = "用户名不能为空")
    @Size(min = 2, max = 20, message = "用户名长度必须在2-20之间")
    private String username;
    
    @NotBlank(message = "省份不能为空")
    private String province;
    
    @NotBlank(message = "城市不能为空")
    private String city;
    
    @NotBlank(message = "区县不能为空")
    private String district;
    
    @NotBlank(message = "详细地址不能为空")
    private String detail;
    
    @NotEmpty(message = "至少需要一个联系方式")
    private List<ContactInfoRequest> contactInfos;
}

@Data
public class ContactInfoRequest implements Serializable {
    
    @NotBlank(message = "联系方式类型不能为空")
    private String type;
    
    @NotBlank(message = "联系方式不能为空")
    private String value;
}
```

#### 2.7 结果对象（Result）规范

1. **基本要求**
   - 类名必须以 Result 结尾
   - 必须实现 Serializable 接口
   - 必须使用 @Data 注解
   - 应该只包含需要返回的数据
   - 必须使用Spring Doc 注解对参数进行描述

2. **代码规范**
```java
@Data
public class UserResult implements Serializable {
    private String userId;
    private String username;
    private UserStatus status;
    private AddressResult address;
    private List<ContactInfoResult> contactInfos;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
}

@Data
public class AddressResult implements Serializable {
    private String province;
    private String city;
    private String district;
    private String detail;
}

@Data
public class ContactInfoResult implements Serializable {
    private String type;
    private String value;
}
```

#### 2.8 对象转换器（Assembler）规范

1. **基本要求**
   - 类名必须以 Assembler 结尾
   - 必须使用 @Component 注解
   - 必须提供领域对象到结果对象的转换方法
   - 建议使用 MapStruct 框架
   - 方法名必须使用 "to + 返回类型" 的形式
   - 列表转换方法使用复数形式

2. **代码规范**
```java
@Mapper(componentModel = "spring")
public interface UserAssembler {
    
    // 单个对象转换
    UserResult toUserResult(User user);
    
    AddressResult toAddressResult(Address address);
    
    ContactInfoResult toContactInfoResult(ContactInfo contactInfo);
    
    // 列表转换
    List<UserResult> toUserResults(List<User> users);
    
    List<ContactInfoResult> toContactInfoResults(List<ContactInfo> contactInfos);
    
    // 分页转换
    default Page<UserResult> toUserResultPage(Page<User> page) {
        return page.map(this::toUserResult);
    }
    
    // 请求对象转换
    Address toAddress(CreateUserRequest request);
    
    ContactInfo toContactInfo(ContactInfoRequest request);
    
    List<ContactInfo> toContactInfos(List<ContactInfoRequest> requests);
}
```

3. **命名规范说明**
   - 单个对象转换：to + 目标类型名称
   - 列表转换：to + 目标类型名称 + s
   - 分页转换：to + 目标类型名称 + Page
   - 请求对象转换：to + 目标领域对象名称

#### 2.9 最佳实践

1. **控制器设计**
   - 保持控制器简单，只负责请求处理和响应转换
   - 使用统一的响应格式
   - 合理使用 HTTP 方法和状态码
   - 提供清晰的 API 文档

2. **应用服务设计**
   - 应用服务方法应该对应一个完整的用例
   - 保持事务边界的正确性
   - 不包含业务规则，只负责协调
   - 处理好异常转换

3. **查询条件设计**
   - 合理使用查询操作符
   - 考虑查询性能
   - 提供必要的查询条件组合

4. **请求对象设计**
   - 提供完整的参数验证
   - 使用嵌套对象表达复杂结构
   - 考虑向后兼容性

5. **结果对象设计**
   - 只返回必要的数据
   - 考虑数据敏感性
   - 提供合适的序列化配置

6. **转换器设计**
   - 使用 MapStruct 提高开发效率
   - 处理好空值转换
   - 提供批量转换方法

### 3. 基础设施层开发规范

#### 3.1 包结构规范
基础设施层的包名是infrastructure，是根包的子目录。
包含以下目录:
```
infrastructure
├── config           # 配置类
├── persistence      # 持久化实现
│   └── repository   # 仓储实现类
├── integration      # 外部系统集成
├── common           # 公共组件
│   ├── utils       # 工具类
│   └── constants   # 常量定义
└── security         # 安全相关
```
