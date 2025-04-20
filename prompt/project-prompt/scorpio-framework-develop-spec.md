# Scorpio-Framework开发文档

## 路径信息
```yaml
basePackage: com.congyuntech.scorpio.framework
modules:
  - core.congestive    # 聚合根相关模块
    exports:
      - com.congyuntech.scorpio.framework.core.congestive.Congestive
      - com.congyuntech.scorpio.framework.core.congestive.CongestiveException
      - com.congyuntech.scorpio.framework.core.congestive.CongestiveNotFoundException
      - com.congyuntech.scorpio.framework.core.congestive.CongestiveRepository
      - com.congyuntech.scorpio.framework.core.congestive.CongestiveEntityListener
      - com.congyuntech.scorpio.framework.core.congestive.id.CongestiveId
      - com.congyuntech.scorpio.framework.core.congestive.id.CongestiveIdGenerator
      - com.congyuntech.scorpio.framework.core.congestive.id.SnowflakeGenerator
      - com.congyuntech.scorpio.framework.core.congestive.manager.CongestiveManager
      - com.congyuntech.scorpio.framework.core.congestive.provider.CongestiveProvider
      - com.congyuntech.scorpio.framework.core.congestive.validation.CongestiveValidator
      - com.congyuntech.scorpio.framework.core.congestive.validation.CongestiveNotValidException

  - core.data    # 数据相关模块
    exports:
      - com.congyuntech.scorpio.framework.core.data.jpa.entity.BaseEntity

  - core.enumeration    # 枚举相关模块
    exports:
      - com.congyuntech.scorpio.framework.core.enumeration.AnnotationEnum
      - com.congyuntech.scorpio.framework.core.enumeration.BeautifulEnum
      - com.congyuntech.scorpio.framework.core.enumeration.EnumAttribute
      - com.congyuntech.scorpio.framework.core.enumeration.EnumAttributes
      - com.congyuntech.scorpio.framework.core.enumeration.parser.AttributeValueParser
      - com.congyuntech.scorpio.framework.core.enumeration.parser.StringParser

  - core.security    # 安全相关模块
    exports:
      - com.congyuntech.scorpio.framework.core.security.SecurityFilter
      - com.congyuntech.scorpio.framework.core.security.SecurityWebTokenFilter
      - com.congyuntech.scorpio.framework.core.security.AbstractSecurityFilter
      - com.congyuntech.scorpio.framework.core.security.authentication.Authentication

  - core.trouble    # 异常处理模块
    exports:
      - com.congyuntech.scorpio.framework.core.trouble.Trouble
      - com.congyuntech.scorpio.framework.core.trouble.TroublePrefix
      - com.congyuntech.scorpio.framework.core.trouble.TroubleEnum
      - com.congyuntech.scorpio.framework.core.trouble.TroubleException
  - core.service.query    # 查询服务模块
    exports:
      - com.congyuntech.scorpio.framework.core.service.query.CriteriaParser
      - com.congyuntech.scorpio.framework.core.service.query.ExpressionParser
      - com.congyuntech.scorpio.framework.core.service.query.QueryExecutor
      - com.congyuntech.scorpio.framework.core.service.query.QueryExpression
      - com.congyuntech.scorpio.framework.core.service.query.QueryExpressionService
      - com.congyuntech.scorpio.framework.core.service.query.QueryServiceFactory
      - com.congyuntech.scorpio.framework.core.service.query.expression.Embed
      - com.congyuntech.scorpio.framework.core.service.query.expression.Expression
      - com.congyuntech.scorpio.framework.core.service.query.expression.Expressions
      - com.congyuntech.scorpio.framework.core.service.query.expression.Join
      - com.congyuntech.scorpio.framework.core.service.query.expression.JsonPath
      - com.congyuntech.scorpio.framework.core.service.query.expression.Operator
      - com.congyuntech.scorpio.framework.core.service.query.expression.Path
      - com.congyuntech.scorpio.framework.core.service.query.jpa.JpaExpressionParser
      - com.congyuntech.scorpio.framework.core.service.query.jpa.JpaQueryExecutor
      - com.congyuntech.scorpio.framework.core.service.query.jpa.JpaQueryExpression

```

## Congestive 聚合根模块

### 概述

Congestive 是 Scorpio Framework 的核心模块之一，它提供了一套完整的聚合根（Aggregate Root）实现方案。该模块基于领域驱动设计（DDD）思想，通过简单的接口实现和注解配置，帮助开发者快速构建具有充血模型特征的领域实体。

主要特性：
1. 统一的聚合根生命周期管理
2. 灵活的业务标识生成策略
3. 强大的数据验证机制
4. 简洁的仓储查询能力
5. 完善的异常处理机制

通过 Congestive 模块，开发者可以：
- 将实体类转变为具有完整业务行为的充血模型
- 实现统一的业务标识生成和管理
- 集中管理实体的业务规则验证
- 使用简洁的方式进行数据访问

这个模块特别适合：
- 需要实现 DDD 架构的项目
- 需要统一管理实体标识的场景
- 需要规范化实体验证逻辑的场景
- 期望简化数据访问层代码的项目

### 使用 Congestive 接口定义聚合根

#### 基本定义

要创建一个聚合根，需要实现 Congestive 接口。这个接口有两个泛型参数：
- T: 聚合根实体类型
- R: 对应的 Repository 类型

基本示例：
```java
@Entity
@Table(name = "user")
public class User implements Congestive<User, UserRepository> {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @CongestiveId(generator = SnowflakeGenerator.class)
    private String userId;
    
    private String name;
    private String phoneNo;
    
    // 业务字段...
}
```

#### 关键注解说明

1. @CongestiveId
   - 用于标注业务标识字段
   - 必须应用在 String 类型的字段上
   - 通过 generator 属性指定 ID 生成器
   ```java
   // 使用默认的雪花算法生成器
   @CongestiveId(generator = SnowflakeGenerator.class)
   private String userId;
   
   // 或者使用自定义的 ID 生成器
   @CongestiveId(generator = CustomUserIdGenerator.class)
   private String userId;
   ```

2. 自定义 ID 生成器
   ```java
   public class CustomUserIdGenerator implements CongestiveIdGenerator {
       @Override
       public String nextUid() {
           // 实现自定义的 ID 生成逻辑
           return "USER_" + System.currentTimeMillis();
       }
   }
   ```

3. @Entity 和 @Table
   - 标准的 JPA 注解
   - @Table 用于指定表名，使用聚合根名称作为表名

#### 继承 BaseEntity

推荐聚合根实体继承 BaseEntity 以获得基础字段支持：

```java
@Entity
@Table(name = "user")
public class User extends BaseEntity implements Congestive<User, UserRepository> {
    
    @CongestiveId(generator = SnowflakeGenerator.class)
    private String userId;
    
    private String name;
    private String phoneNo;
    
    // BaseEntity 已经包含：
    // - id (主键)
    // - version (版本号)
    // - createdTime (创建时间)
    // - updatedTime (更新时间)
}
```

#### 核心功能
1. 聚合根实体操作方法
```java
@Service
public class UserService {
    
    // 保存实体
    public User createUser(String name, String email) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        return user.save();  // 直接调用实体的 save() 方法
    }
    
    // 删除实体
    public void removeUser(String userId) {
        User user = Congestive.get(userId, User.class);
        user.delete();  // 直接调用实体的 delete() 方法
    }
}
```
2. 静态查询方法
Congestive 接口提供了一系列静态查询方法：
```java
@Service
public class UserService {
    
    // 根据聚合根ID获取实体
    public User getUser(String userId) {
        return Congestive.get(userId, User.class);
    }
    
    // 根据属性查询单个实体（返回 Optional）
    public Optional<User> findByEmail(String email) {
        return Congestive.findByAttribute("email", email, User.class);
    }
    
    // 根据属性查询单个实体（不存在则抛出异常）
    public User getByPhone(String phone) {
        return Congestive.getByAttribute("phoneNo", phone, User.class);
    }
    
    // 检查属性值是否存在
    public boolean isEmailExists(String email) {
        return Congestive.existsByAttribute("email", email, User.class);
    }
    
    // 根据属性查询多个实体
    public List<User> findByStatus(UserStatus status) {
        return Congestive.findAllByAttribute("status", status, User.class);
    }
}

3. 使用 JPA 元模型查询
为了提供类型安全的查询，可以使用 JPA 元模型：
```java
@Service
public class UserService {
    
    // 使用元模型进行查询
    public Optional<User> findByEmail(String email) {
        return Congestive.findByAttribute(User_.email, email);
    }
    
    public User getByPhone(String phone) {
        return Congestive.getByAttribute(User_.phoneNo, phone);
    }
    
    public boolean isEmailExists(String email) {
        return Congestive.existsByAttribute(User_.email, email);
    }
    
    public List<User> findByStatus(UserStatus status) {
        return Congestive.findAllByAttribute(User_.status, status);
    }
}
```
4. 获取 Repository
如果需要使用更复杂的查询，可以获取实体的 Repository：
```java
@Service
public class UserService {
    
    // 通过实体实例获取 Repository
    public List<User> findActiveUsers(String userId) {
        User user = Congestive.get(userId, User.class);
        return user.repository().findByStatus(UserStatus.ACTIVE);
    }
    
    // 直接获取 Repository
    public List<User> searchUsers(String keyword) {
        UserRepository repository = Congestive.getRepository(User.class);
        return repository.searchByNameOrEmail(keyword);
    }
}
```

### 定义 CongestiveRepository
#### 基本定义

CongestiveRepository 接口继承自 JpaRepository，为聚合根提供基础的数据访问能力。定义 Repository 只需要继承 CongestiveRepository 接口：

```java
@Repository
public interface UserRepository extends CongestiveRepository<User> {
    // 可以添加自定义查询方法
}
```

#### 核心功能

CongestiveRepository 提供了以下核心方法：

1. 属性查询
```java
// 根据属性查找单个实体
Optional<T> findByAttribute(String attributeName, Object value);
Optional<T> findByAttribute(SingularAttribute<T, ?> attribute, Object value);

// 检查特定属性值的实体是否存在
boolean existsByAttribute(String attributeName, Object value);
boolean existsByAttribute(SingularAttribute<T, ?> attribute, Object value);

// 根据属性查找所有匹配的实体
List<T> findAllByAttribute(String attributeName, Object value);
List<T> findAllByAttribute(SingularAttribute<T, ?> attribute, Object value);
```

#### 使用示例

1. 基本查询
```java
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    public Optional<User> findByPhone(String phoneNo) {
        // 使用字符串指定属性名
        return userRepository.findByAttribute("phoneNo", phoneNo);
        
        // 或使用 JPA 元模型（推荐）
        return userRepository.findByAttribute(User_.phoneNo, phoneNo);
    }
}
```

2. 结合 JPA 元模型
```java
// 使用 JPA 元模型可以提供类型安全的查询
public boolean isPhoneExists(String phoneNo) {
    return userRepository.existsByAttribute(User_.phoneNo, phoneNo);
}

public List<User> findUsersByStatus(UserStatus status) {
    return userRepository.findAllByAttribute(User_.status, status);
}
```

#### 自定义查询方法

除了使用 CongestiveRepository 提供的通用方法外，还可以在 Repository 接口中定义自定义的查询方法：

```java
@Repository
public interface UserRepository extends CongestiveRepository<User> {
    // 使用方法名定义查询
    List<User> findByAgeGreaterThan(int age);
    
    // 使用 @Query 注解定义查询
    @Query("SELECT u FROM User u WHERE u.status = :status AND u.age > :age")
    List<User> findActiveUsersOlderThan(
        @Param("status") UserStatus status, 
        @Param("age") int age
    );
    
    // 使用 QueryDSL 支持
    @Override
    default List<User> findActiveUsers() {
        QUser user = QUser.user;
        return from(user)
            .where(user.status.eq(UserStatus.ACTIVE))
            .fetch();
    }
}
```

#### 最佳实践

1. 查询方法选择
   - 优先使用 CongestiveRepository 提供的通用方法
   - 对于复杂查询，使用自定义方法
   - 推荐使用 JPA 元模型而不是字符串属性名

2. 性能考虑
   - 需要分页的场景使用 findAll 的分页重载
   - 大数据量查询时考虑使用流式查询
   - 合理使用索引优化查询性能

3. 命名规范
   - 查询方法名应该清晰表达其功能
   - 遵循 JPA 命名规范
   - 使用领域术语而不是技术术语

4. 注意事项
   - 避免在 Repository 中包含业务逻辑
   - 查询方法应该是幂等的
   - 合理使用事务注解

### 定义 CongestiveValidator

#### 基本定义

CongestiveValidator 是聚合根的验证器，提供两种验证机制：
1. Bean Validation (JSR-380) 标准验证
2. 自定义业务规则验证

基本示例：
```java
@Component
public class UserValidator implements CongestiveValidator<User> {
    
    @Override
    public void validateSave(User user) throws CongestiveNotValidException {
        // 验证手机号唯一性
        user.repository().findByAttribute(User_.PHONE_NO, user.getPhoneNo())
                .filter(t -> !t.getUserId().equals(user.getUserId()))
                .ifPresent(t -> {
                    throw new CongestiveNotValidException("手机号已被注册");
                });
    }

    @Override
    public void validateDelete(User user) throws CongestiveNotValidException {
        // 删除前的业务规则验证
        if (user.getStatus() == UserStatus.ACTIVE) {
            throw new CongestiveNotValidException("活跃用户不能删除");
        }
    }
}
```

#### Bean Validation 支持

CongestiveValidator 内置支持 Jakarta Bean Validation，可以直接使用标准注解：

```java
@Entity
public class User implements Congestive<User, UserRepository> {
    
    @CongestiveId(generator = SnowflakeGenerator.class)
    private String userId;
    
    @NotBlank(message = "用户名不能为空")
    @Size(min = 2, max = 20, message = "用户名长度必须在2-20之间")
    private String username;
    
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phoneNo;
    
    @Email(message = "邮箱格式不正确")
    private String email;
}
```

Bean Validation 会在 save 操作前自动执行。

#### 核心方法

1. validateSave
   - 在保存聚合根前执行
   - 验证失败时抛出 CongestiveNotValidException
   - 用于实现复杂的业务规则验证

2. validateDelete
   - 在删除聚合根前执行
   - 验证失败时抛出 CongestiveNotValidException
   - 用于确保删除操作不会破坏业务规则

#### 使用示例

1. 复杂业务规则验证
```java
@Component
public class OrderValidator implements CongestiveValidator<Order> {
    
    @Override
    public void validateSave(Order order) {
        // 验证订单金额
        if (order.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new CongestiveNotValidException("订单金额必须大于0");
        }
        
        // 验证订单项
        if (order.getItems().isEmpty()) {
            throw new CongestiveNotValidException("订单必须包含至少一个商品");
        }
        
        // 验证收货地址
        if (order.getDeliveryAddress() == null) {
            throw new CongestiveNotValidException("收货地址不能为空");
        }
    }
}
```

2. 组合验证规则
```java
@Component
public class ProjectValidator implements CongestiveValidator<Project> {
    
    @Override
    public void validateSave(Project project) {
        validateProjectDates(project);
        validateProjectMembers(project);
        validateProjectBudget(project);
    }
    
    private void validateProjectDates(Project project) {
        if (project.getEndDate().isBefore(project.getStartDate())) {
            throw new CongestiveNotValidException("项目结束日期不能早于开始日期");
        }
    }
    
    private void validateProjectMembers(Project project) {
        if (project.getMembers().isEmpty()) {
            throw new CongestiveNotValidException("项目必须至少有一个成员");
        }
    }
    
    private void validateProjectBudget(Project project) {
        if (project.getBudget().compareTo(BigDecimal.ZERO) <= 0) {
            throw new CongestiveNotValidException("项目预算必须大于0");
        }
    }
}
```

#### 最佳实践

1. 验证规则设计
   - 优先使用 Bean Validation 注解进行基础字段验证
   - 在 validateSave 中实现复杂的业务规则验证
   - 保持验证逻辑的清晰和可维护性

2. 异常处理
   - 使用明确的错误消息
   - 统一使用 CongestiveNotValidException 抛出验证失败
   - 在全局异常处理器中统一处理验证异常

3. 性能考虑
   - 避免在验证器中执行重量级操作
   - 合理使用缓存减少数据库查询
   - 验证逻辑应该是幂等的

4. 代码组织
   - 将复杂的验证逻辑拆分为多个私有方法
   - 保持验证方法的单一职责
   - 适当添加注释说明验证规则

## Trouble 异常处理模块

### 概述

Trouble 模块提供了一套统一的异常定义和处理机制，通过枚举和注解的方式，实现了业务异常的标准化定义。

主要特性：
1. 基于枚举的异常定义
2. 支持异常码前缀
3. 链式的异常构建方式
4. 与 HTTP 状态码的自然映射

### 核心组件

#### 1. Trouble 注解
用于在枚举字段上定义异常信息：
```java
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Trouble {
    HttpStatus status() default HttpStatus.BAD_REQUEST;  // HTTP状态码
    String code();        // 异常码
    String message();     // 异常消息
}
```

#### 2. TroublePrefix 注解
用于在枚举类上定义异常码前缀：
```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface TroublePrefix {
    String value();    // 异常码前缀
}
```

#### 3. TroubleEnum 接口
异常枚举需要实现的接口：
```java
public interface TroubleEnum extends AnnotationEnum {
    default TroubleException asException() {
        var troublePrefix = getClassAnnotation(TroublePrefix.class);
        String prefix = troublePrefix == null ? "" : troublePrefix.value();
        var trouble = getFieldAnnotation(Trouble.class);
        return new TroubleException(trouble.status(), prefix + trouble.code(), trouble.message());
    }
}
```

### 使用示例

1. 定义异常枚举：
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
    USERNAME_ALREADY_EXISTS
}
```

2. 使用异常：
```java
@Service
public class UserService {
    
    public User getUser(String userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> UserTrouble.USER_NOT_FOUND
                .asException()
                .detail("用户ID: " + userId)
                .thrown()
            );
    }
    
    public void createUser(String username) {
        if (userRepository.existsByUsername(username)) {
            UserTrouble.USERNAME_ALREADY_EXISTS
                .asException()
                .detail("用户名: " + username)
                .thrown();
        }
        
        try {
            // 业务逻辑
        } catch (Exception e) {
            UserTrouble.USERNAME_ALREADY_EXISTS
                .asException()
                .detail("创建用户失败")
                .cause(e)
                .thrown();
        }
    }
}
```

### 异常处理

TroubleException 提供了链式的异常构建方法：

```java
SomeTrouble.SOME_ERROR
    .asException()           // 创建异常实例, 返回一个 TroubleException 实例
    .detail("详细信息")      // 通过TroubleException 的 detail 方法设置详细信息
    .cause(otherException)   // 通过TroubleException 的 cause 方法设置原因异常
    .thrown();              // 通过TroubleException 的 thrown 方法抛出异常
```

异常信息结构：
```java
public class TroubleException extends RuntimeException {
    private final HttpStatus status;    // HTTP状态码
    private final String code;          // 异常码
    private final String message;       // 异常消息
    private String detailMessage;       // 详细信息
}
```

### 最佳实践

1. 异常定义
   - 使用有意义的前缀区分不同领域的异常
   - 异常码应该具有规律性和可读性
   - 异常消息应该简洁明确
   - 合理使用 HTTP 状态码映射业务语义

2. 异常使用
   - 使用 asException() 创建异常实例
   - 使用 detail() 提供更多上下文信息
   - 使用 cause() 保留原始异常信息
   - 使用 thrown() 显式抛出异常

3. 异常处理
   - 在全局异常处理器中统一处理
   - 合理记录异常日志
   - 确保异常信息的安全性
   - 提供有意义的错误响应

4. 注意事项
   - 异常码应全局唯一
   - 避免在异常消息中包含敏感信息
   - 详细信息应该有助于问题诊断
   - 保持异常处理的一致性

## Enumeration 枚举增强模块

### 概述

Enumeration 模块提供了一套增强的枚举处理机制，通过注解和接口的方式，使枚举类型能够携带更多的元数据信息，并支持灵活的数据解析。

主要特性：
1. 支持为枚举添加任意键值对属性
2. 支持属性值的自定义解析
3. 提供统一的注解访问机制
4. 支持枚举数据的序列化

### 核心组件

#### 1. AnnotationEnum 接口
提供基础的枚举注解访问能力：
```java
public interface AnnotationEnum {
    // 获取当前枚举实例
    default Enum<?> thisEnum();
    
    // 获取枚举字段上的注解
    default <T extends Annotation> T getFieldAnnotation(Class<T> annotationClass);
    
    // 获取枚举类上的注解
    default <T extends Annotation> T getClassAnnotation(Class<T> annotationClass);
}
```

#### 2. BeautifulEnum 接口
继承自 AnnotationEnum，提供枚举数据序列化能力：
```java
public interface BeautifulEnum extends AnnotationEnum {
    // 获取枚举的所有属性数据
    default Map<String, Object> getEnumData();
}
```

#### 3. EnumAttribute 注解
用于定义枚举字段的属性：
```java
@Documented
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Repeatable(EnumAttributes.class)
public @interface EnumAttribute {
    String key();    // 属性键
    String value();  // 属性值
    Class<? extends AttributeValueParser> parser() default StringParser.class;  // 值解析器
}
```

#### 4. AttributeValueParser 接口
用于自定义属性值的解析逻辑：
```java
public interface AttributeValueParser<T> {
    T parse(String value);
}
```

### 使用示例

1. 基本使用：
```java
public enum UserStatus implements BeautifulEnum {
    @EnumAttribute(key = "text", value = "活跃")
    @EnumAttribute(key = "color", value = "green")
    ACTIVE,
    
    @EnumAttribute(key = "text", value = "已禁用")
    @EnumAttribute(key = "color", value = "red")
    DISABLED
}
```

2. 使用自定义解析器：
```java
// 定义解析器
public class JsonParser implements AttributeValueParser<Map<String, Object>> {
    @Override
    public Map<String, Object> parse(String value) {
        return JsonUtils.parseObject(value);
    }
}

// 在枚举中使用
public enum OrderStatus implements BeautifulEnum {
    @EnumAttribute(
        key = "config", 
        value = "{\"nextStatus\":[\"PAID\",\"CANCELLED\"]}", 
        parser = JsonParser.class
    )
    CREATED,
    
    @EnumAttribute(
        key = "config", 
        value = "{\"nextStatus\":[\"SHIPPED\"]}", 
        parser = JsonParser.class
    )
    PAID
}
```

3. 获取枚举数据：
```java
// 获取单个枚举实例的所有属性
Map<String, Object> data = UserStatus.ACTIVE.getEnumData();
// 输出：{
//   "text": "活跃",
//   "color": "green",
//   "code": "ACTIVE",
//   "ordinal": 0
// }
```

### 最佳实践

1. 属性定义
   - 使用清晰的键名
   - 相关属性使用统一的命名规范
   - 合理使用自定义解析器处理复杂数据

2. 解析器设计
   - 解析器应该是无状态的
   - 处理好解析异常
   - 对于复杂数据结构，建议使用专门的解析器

3. 数据组织
   - 相关的属性应该组织在一起
   - 避免在一个枚举中存储过多属性
   - 考虑属性的复用性

4. 注意事项
   - 枚举属性应该是不可变的
   - 解析器的实现应该是线程安全的
   - 避免在解析器中执行耗时操作
   - 注意属性值的数据量大小

## QueryService 查询服务模块

### 概述

QueryService 模块提供了一套基于注解的动态查询框架，通过简单的注解配置，即可实现复杂的查询条件组装。该模块主要解决了在 JPA 环境下构建动态查询的复杂性问题。

主要特性：
1. 声明式查询条件定义
2. 支持复杂的查询路径
3. 灵活的条件组合
4. 支持 JSON 路径查询
5. 内置多种查询操作符

### 核心组件

#### 1. Expression 注解
用于定义查询条件：
```java
@Expression(
    path = @Path(attribute = "name"),
    operator = Operator.CONTAINS
)
private String nameKeyword;

// 支持多个条件
@Expressions({
    @Expression(path = @Path("status"), operator = Operator.EQUALS),
    @Expression(path = @Path("type"), operator = Operator.EQUALS)
})
private String statusOrType;
```

#### 2. Path 注解
定义查询路径：
```java
@Path(
    // 基本属性
    attribute = "name",
    
    // 关联查询
    join = @Join(
        attribute = "department",
        type = JoinType.LEFT
    ),
    
    // 嵌入对象
    embed = @Embed(
        attribute = "address"
    ),
    
    // JSON 路径
    jsonPath = @JsonPath(
        type = String.class,
        value = "$.name"
    )
)
```

#### 3. Operator 枚举
支持的查询操作符：
```java
public enum Operator {
    EQUALS, EQ,           // 等于
    NOT_EQUALS, NE,       // 不等于
    CONTAINS,             // 包含
    NOT_CONTAINS,         // 不包含
    LESS_THAN, LT,        // 小于
    LESS_THAN_OR_EQUALS, LE,  // 小于等于
    GREATER_THAN, GT,     // 大于
    GREATER_THAN_OR_EQUALS, GE // 大于等于
}
```

### 使用示例

1. 定义查询条件类：
```java
@Data
public class UserQuery {
    @Expression(path = @Path("name"), operator = Operator.CONTAINS)
    private String nameKeyword;
    
    @Expression(path = @Path("age"), operator = Operator.GREATER_THAN)
    private Integer minAge;
    
    @Expression(
        path = @Path(
            attribute = "department.name",
            join = @Join(attribute = "department")
        )
    )
    private String departmentName;
    
    @Expression(
        path = @Path(
            attribute = "data",
            jsonPath = @JsonPath(
                type = String.class,
                value = "$.tags[*]"
            )
        ),
        operator = Operator.CONTAINS
    )
    private String tag;
}
```

2. 创建查询服务：
```java
@Service
public class UserQueryService {

    
    public Page<User> queryUsers(UserQuery query, Pageable pageable) {
        var queryService = QueryServiceFactory.withCongestive(User.class); // 使用QueryServiceFactory 创建对应聚合根的QueryService
        return queryService.queryPage(query, pageable);
    }
    
    public List<User> queryUsers(UserQuery query) {
        return queryService.queryList(query);
    }
}
```

3. 使用查询服务：
```java
@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserQueryService queryService;
    
    @GetMapping
    public Page<User> queryUsers(UserQuery query, Pageable pageable) {
        return queryService.queryUsers(query, pageable);
    }
}
```

### 查询路径类型

1. 基本属性查询
```java
@Expression(path = @Path("name"))
private String name;
```

2. 关联对象查询
```java
@Expression(
    path = @Path(
        attribute = "department.name",
        join = @Join(attribute = "department")
    )
)
private String departmentName;
```

3. 嵌入对象查询
```java
@Expression(
    path = @Path(
        attribute = "street",
        embed = @Embed(attribute = "address")
    )
)
private String street;
```

4. JSON 字段查询
```java
@Expression(
    path = @Path(
        attribute = "metadata",
        jsonPath = @JsonPath(
            type = String.class,
            value = "$.tags[*]"
        )
    )
)
private String tag;
```

### 最佳实践

1. 查询条件设计
   - 将查询条件封装为独立的类
   - 合理使用操作符
   - 注意查询路径的性能影响
   - 避免过深的关联查询

2. 性能考虑
   - 合理使用分页查询
   - 避免不必要的关联查询
   - 注意 JSON 查询的性能开销
   - 适当使用索引优化查询

3. 代码组织
   - 查询条件类使用 Query 后缀
   - 查询服务类使用 QueryService 后缀
   - 相关的查询条件放在同一个包中
   - 保持查询条件的可维护性

4. 注意事项
   - 注意空值处理
   - 合理处理查询结果
   - 避免过于复杂的查询条件
   - 考虑查询安全性

## RestResult 统一响应格式

### 概述

RestResult 提供了一套统一的 REST API 响应格式规范，包括成功响应、分页数据、空响应和异常响应等场景的标准处理方式。

主要特性：
1. 统一的响应格式
2. 标准的分页信息处理
3. 规范的异常响应格式
4. 支持 HTTP 标准状态码

### 响应格式

#### 1. 普通成功响应
```java
// 响应格式
ResponseEntity<T>

// 示例
GET /api/users/1
Response:
{
    "id": "1",
    "name": "张三",
    "age": 25
}
```

#### 2. 分页数据响应
```java
// 响应格式
ResponseEntity<List<T>>

// HTTP Headers:
X-Total-Count: 总记录数
X-Total-Page: 总页数
X-Page-Number: 当前页码

// 示例
GET /api/users?page=1&size=10
Response Headers:
X-Total-Count: 100
X-Total-Page: 10
X-Page-Number: 1

Response Body:
[
    {
        "id": "1",
        "name": "张三"
    },
    // ... more items
]
```

#### 3. 空响应
```java
// HTTP Status: 204 No Content
Response: (empty)
```

#### 4. 异常响应
```java
// 响应格式
{
    "code": "错误码",
    "message": "错误消息",
    "detailMessage": "详细信息",
    "application": "应用名称"
}

// 示例
{
    "code": "USER001",
    "message": "用户不存在",
    "detailMessage": "用户ID: 123 不存在",
    "application": "user-service"
}
```

### 使用方式

1. 返回数据：
```java
@GetMapping("/{id}")
public ResponseEntity<User> getUser(@PathVariable String id) {
    User user = userService.getUser(id);
    return RestResult.ok(user);
}
```

2. 返回分页数据：
```java
@GetMapping
public ResponseEntity<List<User>> queryUsers(UserCriteria criteria, Pageable pageable) {
    Page<User> page = userQueryService.queryUsers(criteria, pageable);
    return RestResult.ok(page);
}
```

3. 返回空响应：
```java
@DeleteMapping("/{id}")
public ResponseEntity<?> deleteUser(@PathVariable String id) {
    userService.deleteUser(id);
    return RestResult.noContent();
}
```

4. 异常响应：
```java
@ExceptionHandler(TroubleException.class)
public ResponseEntity<?> troubleHandler(TroubleException trouble) {
    return RestResult.trouble(trouble);
}
```

### 最佳实践

1. 响应设计
   - 遵循 RESTful 设计原则
   - 合理使用 HTTP 状态码
   - 保持响应格式的一致性
   - 避免在成功响应中包装多余的结构

2. 分页处理
   - 使用标准的分页参数（page、size）
   - 通过 HTTP Headers 传递分页信息
   - 分页参数支持零基础和一基础配置
   - 响应体只包含数据列表

3. 异常处理
   - 使用统一的异常响应格式
   - 提供清晰的错误信息
   - 包含必要的上下文信息
   - 考虑安全性，避免暴露敏感信息

4. 注意事项
   - 响应数据应该是自描述的
   - 避免在响应中包含冗余信息
   - 确保响应格式的向后兼容性
   - 合理处理空值和null

### 控制器返回值处理规范

1. **基本要求**
   - 必须使用`RestResult`类处理返回结果，而不是直接使用`ResponseEntity`
   - 查询类接口使用`RestResult.ok()`返回数据
   - 修改类接口（如更新、删除）使用`RestResult.noContent()`返回空内容
   - 修改类方法的返回值类型应声明为`ResponseEntity<?>`

2. **分页接口规范**
   - 分页接口返回类型应声明为`ResponseEntity<List<T>>`，而非`ResponseEntity<Page<T>>`
   - 实际返回`Page`对象时使用`return RestResult.ok(page)`
   - 分页参数`Pageable`必须使用`@ParameterObject`注解，而非`@Parameter(hidden = true)`

3. **代码示例**
```java
// 查询列表（分页）
@GetMapping
public ResponseEntity<List<PromptResult>> queryPrompts(
    @ParameterObject PromptCriteria criteria,
    @ParameterObject Pageable pageable
) {
    Page<PromptResult> page = queryService.queryPrompts(criteria, pageable);
    return RestResult.ok(page);
}

// 获取单个资源
@GetMapping("/{id}")
public ResponseEntity<PromptResult> getPrompt(@PathVariable String id) {
    PromptResult result = queryService.getPrompt(id);
    return RestResult.ok(result);
}

// 创建资源
@PostMapping
public ResponseEntity<PromptResult> createPrompt(@RequestBody @Valid CreatePromptRequest request) {
    PromptResult result = applicationService.createPrompt(request);
    return RestResult.ok(result);
}

// 更新资源
@PutMapping("/{id}")
public ResponseEntity<?> updatePrompt(@PathVariable String id, @RequestBody @Valid CreatePromptRequest request) {
    applicationService.updatePrompt(id, request);
    return RestResult.noContent();
}

// 删除资源
@DeleteMapping("/{id}")
public ResponseEntity<?> deletePrompt(@PathVariable String id) {
    applicationService.deletePrompt(id);
    return RestResult.noContent();
}
```

4. **注意事项**
   - 使用`RestResult`而不是直接构建`ResponseEntity`对象
   - 正确处理分页接口的返回类型声明和实际返回值
   - 保持项目内控制器返回处理方式的一致性
   - 无返回值的方法使用`RestResult.noContent()`，不要使用`ResponseEntity.noContent().build()`
   - 使用`@ParameterObject`注解处理复杂对象参数，特别是`Pageable`

## ApplicationContextUtil 工具类

### 概述

ApplicationContextUtil 是一个 Spring 上下文工具类，提供了在非 Spring 管理的类中获取 Spring Bean、Environment 等功能。该工具类实现了 ApplicationContextAware 接口，在 Spring 启动时自动注入 ApplicationContext。

### 核心功能

#### 1. 获取 Spring Bean

```java
@Component
public class SomeService {
    // 获取指定类型的 Bean
    private UserRepository userRepository = ApplicationContextUtil.getBean(UserRepository.class);
    
    // 获取指定名称的 Bean
    private Object someBean = ApplicationContextUtil.getBean("beanName");
    
    // 获取指定名称和类型的 Bean
    private UserService userService = ApplicationContextUtil.getBean("userService", UserService.class);
}
```

#### 2. 获取 Environment

```java
@Component
public class ConfigService {
    public String getAppName() {
        Environment env = ApplicationContextUtil.getEnvironment();
        return env.getProperty("spring.application.name");
    }
    
    public String getActiveProfile() {
        return ApplicationContextUtil.getEnvironment()
            .getProperty("spring.profiles.active");
    }
}
```

#### 3. 获取或注册 Bean

```java
@Component
public class DynamicService {
    // 如果 Bean 不存在，则使用提供的 Supplier 创建
    private CustomValidator validator = ApplicationContextUtil.getBeanOrRegister(
        CustomValidator.class,
        () -> new CustomValidator("default")
    );
}
```

#### 4. 获取指定类型的所有 Bean

```java
@Component
public class ValidationService {
    // 获取所有 Validator 类型的 Bean
    public void initValidators() {
        Collection<Validator> validators = ApplicationContextUtil.getBeansOfType(Validator.class);
        validators.forEach(this::registerValidator);
    }
}
```

### 注意事项

1. 使用时机
   - 工具类需要等待 Spring 容器初始化完成后才能使用
   - 在静态初始化块中不能使用该工具类
   - 建议在业务代码执行时使用

2. 异常处理
   - 所有方法在 ApplicationContext 为 null 时会抛出 IllegalStateException
   - 建议在使用时进行适当的异常处理

3. 最佳实践
   - 优先使用依赖注入而不是工具类
   - 仅在无法使用依赖注入的场景下使用
   - 避免在核心业务逻辑中过度依赖该工具类

4. 性能考虑
   - getBean 操作是轻量级的
   - 对频繁使用的 Bean，建议获取一次后缓存
   - 避免在循环中重复获取相同的 Bean

### 使用示例

1. 在工具类中使用：
```java
public class FileUtils {
    public static String getUploadPath() {
        // 获取配置属性
        return ApplicationContextUtil.getEnvironment()
            .getProperty("app.upload.path", "/tmp/upload");
    }
}
```

2. 在动态创建的对象中使用：
```java
public class DynamicHandler {
    public void process() {
        // 获取所需的 Service
        UserService userService = ApplicationContextUtil.getBean(UserService.class);
        userService.doSomething();
    }
}
```

3. 条件化获取 Bean：
```java
public class ServiceSelector {
    public PaymentService getPaymentService(String type) {
        String beanName = type + "PaymentService";
        if (ApplicationContextUtil.getApplicationContext()
                .map(ctx -> ctx.containsBean(beanName))
                .orElse(false)) {
            return ApplicationContextUtil.getBean(beanName, PaymentService.class);
        }
        return ApplicationContextUtil.getBean(DefaultPaymentService.class);
    }
}
```
## Controller层开发规范

### 概述

Controller层是遵循DDD架构的应用层组件，负责处理HTTP请求，协调各应用服务的调用，并封装统一的响应格式。

主要特性：
1. RESTful风格API设计
2. 统一的请求和响应格式
3. 完善的API文档支持
4. 清晰的权限管理

### 基本结构

```java
@Tag(name = "模块名称", description = "模块描述")
@RestController
@RequestMapping("/api/资源名称")
@RequiredArgsConstructor
public class 资源名称Controller {
    
    private final 资源名称ApplicationService applicationService;
    private final 资源名称QueryService queryService;
    
    // API方法定义...
}
```

### 核心注解

1. `@RestController`: 标识控制器类
2. `@RequestMapping`: 定义基础URL路径
3. `@RequiredArgsConstructor`: 使用构造器注入依赖
4. `@Tag`: Swagger文档分组注解
5. `@Operation`: Swagger操作描述注解

### HTTP方法映射

根据RESTful规范，使用不同的HTTP方法注解映射不同的操作：

| 操作 | HTTP方法 | 注解 | 示例路径 |
|-----|----------|-----|----------|
| 查询列表 | GET | @GetMapping | /api/customers |
| 查询单个 | GET | @GetMapping | /api/customers/{id} |
| 创建 | POST | @PostMapping | /api/customers |
| 更新 | PUT | @PutMapping | /api/customers/{id} |
| 删除 | DELETE | @DeleteMapping | /api/customers/{id} |
| 部分更新 | PATCH | @PatchMapping | /api/customers/{id} |

### 响应格式

使用`RestResult`工具类封装统一的响应格式：

```java
@GetMapping("/{id}")
public ResponseEntity<资源DTO> get资源(
        @PathVariable String id
) {
    资源DTO result = service.get资源(id);
    return RestResult.ok(result);
}
```

### 参数验证

使用`@Valid`配合Jakarta Bean Validation进行参数验证：

```java
@PostMapping
public ResponseEntity<资源DTO> create资源(
        @RequestBody @Valid Create资源Request request
) {
    资源DTO result = service.create资源(request);
    return RestResult.ok(result);
}
```

### 分页查询

使用Spring Data的Pageable支持分页查询：

```java
@GetMapping
public ResponseEntity<List<资源DTO>> query资源s(
        @ParameterObject 资源Criteria criteria,
        @ParameterObject Pageable pageable
) {
    Page<资源DTO> page = queryService.query资源s(criteria, pageable);
    return RestResult.ok(page);
}
```

### API文档

使用OpenAPI 3/Swagger注解为API添加文档：

```java
@Operation(summary = "创建资源", description = "详细描述")
@PostMapping
public ResponseEntity<资源DTO> create资源(
        @Parameter(description = "参数描述")
        @RequestBody @Valid Create资源Request request
) {
    // ...
}
```

### 最佳实践

1. 控制器设计
   - 一个控制器类对应一个资源实体
   - 方法命名清晰表达意图
   - 使用构造器注入依赖

2. 路径设计
   - 使用复数名词表示资源集合
   - 使用名词不使用动词
   - 子资源使用嵌套路径表示

3. 参数处理
   - 路径参数使用`@PathVariable`
   - 查询参数使用`@RequestParam`
   - 请求体使用`@RequestBody`
   - 使用专门的Request对象封装请求参数

4. 响应处理
   - 使用DTO对象而非领域对象
   - 使用HTTP状态码表示操作结果
   - 统一使用RestResult封装响应

5. 日志记录
   - 在每个方法开始处记录关键信息
   - 使用英文记录日志
   - 日志级别为info

### 完整示例

```java
@Tag(name = "客户管理", description = "客户相关的API接口")
@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {
    
    private final CustomerApplicationService customerService;
    private final CustomerQueryService customerQueryService;
    private final Logger log = LoggerFactory.getLogger(CustomerController.class);
    
    @Operation(summary = "创建客户", description = "创建一个新的客户")
    @PostMapping
    public ResponseEntity<CustomerResult> createCustomer(
            @RequestBody @Valid CreateCustomerRequest request
    ) {
        log.info("Creating new customer with name: {}", request.getName());
        CustomerResult result = customerService.createCustomer(request);
        return RestResult.ok(result);
    }
    
    @Operation(summary = "更新客户", description = "更新指定客户的信息")
    @PutMapping("/{customerId}")
    public ResponseEntity<CustomerResult> updateCustomer(
            @Parameter(description = "客户ID", example = "1234567890")
            @PathVariable String customerId,
            @RequestBody @Valid UpdateCustomerRequest request
    ) {
        log.info("Updating customer with id: {}", customerId);
        CustomerResult result = customerService.updateCustomer(customerId, request);
        return RestResult.ok(result);
    }
    
    @Operation(summary = "获取客户详情", description = "根据ID获取客户详细信息")
    @GetMapping("/{customerId}")
    public ResponseEntity<CustomerResult> getCustomer(
            @Parameter(description = "客户ID", example = "1234567890")
            @PathVariable String customerId
    ) {
        log.info("Fetching customer with id: {}", customerId);
        CustomerResult result = customerService.getCustomer(customerId);
        return RestResult.ok(result);
    }
    
    @Operation(summary = "查询客户列表", description = "根据条件分页查询客户列表")
    @GetMapping
    public ResponseEntity<List<CustomerResult>> queryCustomers(
            @ParameterObject CustomerCriteria criteria,
            @ParameterObject Pageable pageable
    ) {
        log.info("Querying customers with criteria: {}", criteria.getKeywords());
        Page<CustomerResult> page = customerQueryService.queryCustomers(criteria, pageable);
        return RestResult.ok(page);
    }
} 







