

# 数据库

## 数据库基础知识

### 关系型数据库

关系型数据库最典型的数据结构是表，由二维表及其之间的联系所组成的一个数据组织，可以采用结构化查询语言（sql)对数据库进行操作。常见的有`MySQL`，`Oracle`,`DB2`，`SQL Server`等

优点：

+ 易于维护：都是使用表结构，格式一致；
+ 使用方便：SQL语言通用，可用于复杂查询；

缺点：

+ 读写性能比较差，高并发读写需求，尤其是海量数据的高效率读写；
+ 固定的表结构，灵活度不够；

### 非关系数据库

非关系型数据库也称之为NoSQL数据库，是一种数据结构化存储方法的集合，可以是文档或者键值对等。常见的有`Redis`，`MongoDB`，`Memcached`，`HBase`等

优点：

+ 格式灵活，存储数据的格式可以是key，value形式、文档形式、图片形式等，关系型只支持基础类型
+ 速度快：NoSQL可以使用硬盘或者随机存储器作为载体
+ 高扩展性
+ 成本低：nosql数据库部署简单，基本都是开源软件

缺点：

+ 不提供sql支持，学习和使用成本较高
+ 无事务处理
+ 数据结构相对复杂，复杂查询不方便

### SQL语言

结构化查询语言简称SQL，是一种数据库查询和程序设计语言，用于存取数据以及查询、更新和管理关系数据库系统。

分类：

+ 数据定义语句（DDL：Data Definition Language）：`CREATE`，`ALTER`，`DROP`
+ 数据操作语句（DML：Data Manipulation Language）：`INSERT`，`UPDATE`，`DELETE`
+ 数据查询语句（DQL：Data Query Language）：`SELECT`，`FROM`，`WHERE`，`ORDER BY`，`HAVING`
+ 数据控制语句（DCL：Data Control Language）：`GRANT`，`REVOKE`
+ 事务控制语句（TCL：Transaction Control Language）：`COMMIT`，`ROLLBACK`，`SAVEPOINT`

语法：

+ SQL语句不区分大小写，关键字建议大写
+ SQL语句可以单行或多行书写，以分号结尾

### MySQL中的数据类型

+ 整数类型

  + `tinyint(m)`：1个字节 范围-128-127
  + `smallint(m)`：2个字节 范围-32768-32767
  + `mediumint(m)`：3个字节 范围-8388608-8388607
  + **`int(m)`**：4个字节 范围-2147483648-2147483647
  + `bigint(m)`：8个字节 范围+-9.22*10的18次方

  > 数值类型中的长度m是指显示长度，不表示存储长度，只有字段指定zerofill时才有用
  >
  > 例如：int(3)，如果实际值是2，如果列指定了zerofill，查询结果就是002，左边用0来填充

+ 浮点类型

  + `float(m,d)`：单精度浮点型8位精度(4字节)  m总个数，d小数位
  + `double(m,d)`：双精度浮点型16位精度(8字节)  m总个数，d小数位

+ 字符类型 (char和varchar必须给定n)

  + **`char(n)`**：固定长度，最多255个字符，每条数据占用等长字节空间，适合用在身份证号码、手机号等定长        
  + `tinytext`：可变长度，最多255个字符
  + **`varchar(n)`**：可变长度，最多65535个字符，可以设置最大长度；适合用在长度可变的属性
  + **`text`**：可变长度，最多65535个字，不设置长度，当不知道属性的最大长时，适合用text
  + `mediumtext`：可变长度，最多2的24方-1个字符
  + `longtext`：可变长度，最多2的32方-1个字符

  > 按照查询速度：char最快，varchar次之，text最慢
  >
  > 使用建议：
  >
  > + 经常变化的字段用varchar
  > + 知道固定长度的用char
  > + 尽量用varchar
  > + 超过255字符的只能用varchar或者text
  > + 能用varchar的地方不用text

+ 日期类型
  + `date`：日期 YYYY-MM-DD
  + `time`：时间 HH:MM:SS
  + `datetime`：日期时间 YYYY-MM-DD HH:MM:SS
  + `timestamp`：时间戳 YYYYMMDD HHMMSS
+ 二进制数据(BLOB)
  + BLOB和TEXT存储方式不同，TEXT以文本方式存储，英文存储区分大小写，而BLOB是以二进制方式存储，不分大小写
  + BLOB存储的数据只能整体读出
  + TEXT可以指定字符集，BLOB不用指定字符集

### MySQL中的约束

数据库约束是对表中数据进行进一步的限制，保证数据的正确性、有效性和完整性。可以理解为数据库提供的一种数据校验方式

+ 主键约束(Primary Key)   PK

  > 使用最频繁约束。在设计数据表时，一般情况下，都会要求表中设置一个主键。
  >
  > + 不允许为空
  > + 不允许有重复值出现
  > + 保证数据的唯一性

+ 外键约束(Foreign Key) FK

  > 外键约束经常和主键一起使用，用来确保数据的一致性
  >
  > + 允许有空值
  > + 允许有重复
  > + 值必须是参照表的参照列中所包含的值
  > + 保证数据的参照完整性

+ 唯一性约束(Unique)

  > 唯一性约束和主键约束有一个相似的地方，就是它们都能确保列的唯一性。与主键约束不同的是，唯一约束在一个表中可以有多个，并且设置唯一约束的列是允许有空值的
  >
  > + 相同值只能出现一次
  > + 允许为多个列添加唯一性约束
  > + 保证数据的唯一性

+ 非空约束(Not Null)

  > 非空约束用来约束表的字段不能为空
  >
  > + 列中不能有空值
  > + 允许重复值
  > + 允许为多个列添加非空约束
  > + 保证数据没有空值

+ 检查约束(Check)

  > 检查约束也叫用户自定义约束，是用来检查数据表中，字段值是否有效的一个手段，但目前MySQL数据库不支持检查约束。
  >
  > + 用户自定义约束条件
  > + 保证数据满足自定义的条件约束
  > + MySQL目前不支持检查约束

### DDL

```sql
// 创建数据库
CREATE DATABASE 数据库名 DEFAULT CHARACTER SET 字符编码;
// 示例
CREATE DATABASE test DEFAULT CHARACTER SET utf8;

// 删除数据库
DROP DATABASE 数据库名;

// 选择数据库
USE 数据库名;

// 创建表
CREATE TABLE 表名(列名 类型,列名 类型......);
// 示例
CREATE TABLE employees(employee_id int,employee_name varchar(10),salary float(8,2));

// 查看已创建的表
SHOW TABLES;

// 删除表
DROP TABLE 表名;

// 修改表名
ALTER TABLE 旧表名 RENAME 新表名;

// 修改列名
ALTER TABLE 表名 CHANGE COLUMN 旧列名 新列名 类型;

// 修改列类型
ALTER TABLE 表名 MODIFY 列名 新类型;

// 添加新列
ALTER TABLE 表名 ADD COLUMN 新列名 类型;

// 删除列
ALTER TABLE 表名 DROP COLUMN 列名;
```

### 添加主键约束

**单一主键**

使用一个列作为主键列，当该列有重复时，则违反唯一约束。

**联合主键**

使用多个列作为主键列，当多个列的值都相同时，则违反唯一约束。

**主键自增长**

+ 一个表中只能有一个列为自动增长
+ 自动增长的列的类型必须是整数类型
+ 自动增长只能添加到具备主键约束与唯一性约束的列上
+ 删除主键约束或唯一性约束，如果该列拥有自动增长的能力，则需要先去掉自动增长后再删除约束。

```sql
// 修改表添加主键约束
ALTER TABLE 表名 ADD PRIMARY KEY(列名)

// 设置主键列或唯一性约束列自增
ALTER TABLE 表名 MODIFY 列名 类型 AUTO_INCREMENT;

// 删除主键
ALTER TABLE 表名 DROP PRIMARY KEY;

// 删除自增  == (和修改列类型一样)
ALTER TABLE 表名 MODIFY 列名 类型;
```

### 添加删除外键约束

​																			***employee员工表***

| employee_id | name | age  | dep_id |
| ----------- | ---- | ---- | ------ |
| 1           | 张三 | 20   | 10001  |
| 2           | 李四 | 21   | 10001  |
| 3           | 王五 | 22   | 10002  |

​																			***department部门表***

| dep_id | dep_name | dep_location |
| ------ | -------- | ------------ |
| 10001  | 研发部   | 广州         |
| 10002  | 销售部   | 深圳         |

```sql
// 修改表添加外键约束
ALTER TABLE 表名 ADD CONSTRAINT 约束名 FOREIGN KEY(列名) REFERENCES 参照的表名(参照列的列名);
// 约束名  --- 表名+_fk  employee_fk

// 删除外键约束
ALTER TABLE 表名 DROP FOREIGN KEY 约束名;
```

### 添加删除唯一性约束

```sql
// 添加唯一性约束
ALTER TABLE 表名 ADD CONSTRAINT 约束名 UNIQUE(列名);
// 约束名  --- 表名+_uk  employee_uk

// 删除唯一性约束
ALTER TABLE 表名 DROP KEY 约束名;
```

### 添加删除非空约束

```sql
// 添加
ALTER TABLE 表名 MODIFY 列名 类型 NOT NULL;

// 删除
ALTER TABLE 表名 MODIFY 类名 类型 NULL;
```

### 创建表时添加约束

```sql
// 查询表中约束信息
SHOW KEYS FROM 表名;

// 创建表时添加约束
CREATE TABLE 表名(列名 类型 PRIMARY KEY AUTO_INCREMENT,列名 类型 UNIQUE,列名 类型 NOT NULL);
```

### DML

```sql
// 选择插入
INSERT INTO 表名(列名1,列名2,列名3......) VALUES(值1,值2,值3......);

// 完全插入  --- 如果主键是自动增长，需要使用default或者null或者0占位。
INSERT INTO 表名 VALUES(值1,值2,值3.....);

// DDL 创建表时指定默认值
CREATE TABLE 表名(列名 类型 default 默认值,......);

// DDL 修改表添加新列并指定默认
ALTER TABLE 表名 ADD COLUMN 列名 类型名 DEFAULT 默认值;

// 更新数据  --- 注意：更新语句中一定要给定更新条件，否则表中所有的数据都会被更新
UPDATE 表名 SET 列名=值,列名=值 WHERE 条件;

// 删除数据  --- 注意：删除语句中一定要给定更新条件，否则表中所有的数据都会被更新
DELETE FROM 表名 WHERE 条件;

// 清空表
TRUNCATE TABLE 表名;

```

> 默认值处理(DEFAULT)
>
> 在MySQL中可以使用DEFAULT为列设定一个默认值。如果在插入数据时未指定该列的值，那么MySQL会将默认值添加到该列中。
>
> 清空表时DELETE与TRUNCATE区别
>
> + truncate是整体删除，速度较快，delete是逐条删除，速度较慢
> + truncate不写服务器log，delete写服务器log，也就是truncate效率比delete高的原因
> + truncate会重置自增值，相当于自增列会被置为初始值，又重新从1开始记录，而不是接着原来的值。而delete删除以后，自增值仍然会继续累加。

### DQL

```sql
列选择、行选择、连接(多表查询)

// 基本SELECT语句
SELECT *|[DISTINCT] COLUMN|expression [alias],...   FROM 表名;

-	SELECT				是一个或多个字段的列表
-	*					选择所有
-	DISTINCT	 		 禁止重复
- 	column|expression	  选择指定的字段或者表达式
- 	alias				 给所选择的列不同的标题
-	FROM 表名			 指定包含列的表

1. 查询中的列选择

// 选择所有列
SELECT * FROM 表名;

// 选择部分列
SELECT 列名1,列名2 FROM 表名;

1.1 查询中的算术表达式   ---  更改数据显示方式，执行某种运算

// 使用算术运算符
SELECT 列名1,列名2,salary*12 FROM 表名;

定义空值
- null是一个未分配、未知的或不适应的值
- null不是0，也不是空格

// 算术表达式中的空值
包含空值的算术表达式计算结果为空

1.2 MySQL中的别名

// 列别名  --- 两种
SELECT 列名 AS 列别名 FROM 表名 WHERE 条件;
SELECT 列名 列别名 FROM 表名 WHERE 条件;

// 表别名  --- 两种
SELECT 列名 FROM 表名 AS 表别名;
SELECT 列名 FROM 表名 表别名;
// 示例  ---  应用场景  当一个表中字段较多时，可以通过表名.columns 选择对应columns
SELECT emp.employee_id FROM employees emp;

1.3 MySQL中去除重复

SELECT DISTINCT 列名1,列名2 FROM 表名;

2. 查询中的行选择

SELECT *|列名 FROM 表名 WHERE 选择条件;

2.1 比较条件
>, =, >=, <, <=, <> | !=;

// 其他比较

BETWEEN ... AND ...  在两个值之(>= and <=)
IN(SET)				匹配一个任意值列表  IN(5000,6000,8000) 
LIKE 				匹配一个字符模板    % 零个或多个字符 _表示一个字符  '_e%' 字符第二个是e的
IS NULL/NOT NULL      是空值/非空值    

2.2 逻辑条件

AND  	逻辑与
OR		逻辑或
NOT		逻辑非

2.3 ORDER BY 子句 (在SQL语句最后)

 -	ASC 升序，默认
 -	DESC 降序
 
 SELECT */列1,列2... FROM 表名 ORDER BY 列名 DESC;
 
 // 根据别名排序
 SELECT */列1,列2,列3 alias FROM 表名 ORDER BY alias DESC;
 
 // 多列排序
 SELECT */列 FROM 表名 ORDER BY 列1 ASC,列2 DESC;
 
```

> SELECT语句执行顺序：
>
> + FROM子句
> + WHERE子句
> + SELECT子句
> + ORDER BY子句

### SQL函数

不同数据库品牌对SQL函数的支持和函数名字是有差异的，以下是针对MySQL的SQL函数

#### 单行函数

单行函数仅对单个行进行运算，并且每行返回一个结果。常见的函数类型：

+ 字符

  + LOWER(str)|LCASE(str)  转换小写
  + UPPER(str)|UCASE(str)  转换大写

  ```sql
  SELECT employee_id,lower(last_name) FROM employees WHERE last_name = 'devies';
  
  select name,salary,pct,if(isnull(pct),'sal','com') income
  from employees
  where id in(50,80);
  ```

  + LENGTH(str) 
  + CONCAT(s1,s2,..sn)  将多个字符串拼接到一起
  + LPAD(str,len,s2)  将s2填充到字符串使总长度到len
  + REPLACE(s,s1,s2)  将字符串替代字符串s中的s1
  + REVERSE(s)  反转
  + SUBSTR(s,start,len) | SUBSTRING(s,start.len)   index从1开始，不是0
  + TRIM(s)  去除收尾空格

+ 数字

  + abs(x)
  + round(column,len)
  + truncate(clolumn,len)
  + mod(column,n)

+ 日期 mysql当中 YYYY-MM-DD HH:MM:SS 或者 YYYY/MM/DD HH:MM:SS

  + curdate()   -> 2018-09-19
  + curtime()  ->19:59:02
  + date()  
  + day()
  + now()

+ 转换

  + 隐式转换
    + 比如直接给上面的日期格式字符串，会自动转换成日期格式

  + 显示转换
    + DATE_FORMAT(date,format)将日期转换成字符串

    + STR_TO_DATE(str,format) 将字符串转换成日期

+ 通用

  + if(expr,v1,v2) 如果表达式expr成立返回v1，否则返回v2
  + ifnull(v1,v2) 如果v1不为空，返回v1，否则返回v2
  + isnull(expr) 判断表达式是否为null
  + nullif(expr,expr) 比较两个参数是否相同，如果expr1与expr2相等返回null，否则返回expr1
  + coalesce(expr1,expr2,...exprN) 返回参数中的第一个非空表达式
  + CASE expr WHEN condition1 THEN result1 WHEN condition2 THEN result2 ... ELSE result END


#### 多行函数(聚合函数 | 组函数 | 分组函数)

多行函数能够操作成组的行，每个行组给出一个结果，这些函数也被称为组函数

+ AVG 平均值
+ COUNT 计数
+ MAX 最大值
+ MIN 最小值
+ SUM 合计

```sql
// 语法
SELECT			[column,] group_function(column), ...
FROM 			table1
[WHERE 			condition]
[GROUP BY		column]
[ORDER BY		column];

// AVG 和 SUM 只能应用于数值类型
SELECT AVG(salary) FROM employees;

// MIN 和 MAX 用于数字，也可以用于日期，字符串

// COUNT  --- 返回分组中的总行数
- COUNT(*)：返回表中满足SELECT语句的所有列的行数，包括重复行，包括有空值列的行
- COUNT(expr)：返回在列中的由expr指定的非空值的数
- COUNT(DISTINCT expr)：返回在列中的由expr指定的唯一的非空值的数

// 使用原则
- DISTINCT 去重
- 所有聚合函数忽略空值。为了用一个值代替空值，用IFNULL或COALESCE函数

SELECT COUNT(DISTINCT department_id) FROM employees;
```

### 数据分组（GROUP BY）

**创建数据组**

在没有进行数据分组之前，所有聚合函数是将结果集作为一个大的信息组进行处理。但是有时则需要将表的信息划分为较小的组，可以用GROUP BY子句实现

```sql
// 语法
SELECT			[column,] group_function(column), ...
FROM 			table1
[WHERE 			condition]  //  先过滤
[GROUP BY		group_by_expression]    // 介于 WHERE ORDER BY之间，而且GROUP BY子句必须包含列
[ORDER BY		column];

// 基础使用
select dep_id, AVG(salary)
from employees
group by dep_id

// 在多列上使用分组  --- 首先，用部门号分组行，然后在部分号的分组中再用job_id分组行。每个部门的不同工作岗位的员工薪水总额。 

select depart_id dep_id, job_id, SUM(salary)
from employees
group by department_id, job_id;
```

**约束分组结果(HAVING)**

HAVING子句

HAVING子句是对查询结果集分组后的结果进行过滤

WHERE子句约束选择的行，HAVING子句约束组。

```sql
// 语法
SELECT			[column,] group_function(column), ...
FROM 			table1
[WHERE 			condition] 
[GROUP BY		group_by_expression] 
[HAVING			group_condition]
[ORDER BY		column];


SELECT department_id, MAX(salary)
FROM employees
GROUP BY department_id
HAVING MAX(salary)>1000;
```



### 多表查询

>笛卡尔乘积形成，当
>
>+ 一个连接条件被遗漏时
>+ 一个连接条件不正确时
>+ 在第一个表中的所有行被连接到第二个表的所有行时
>
>为了避免笛卡尔乘积形成，在where子句中应当是包含正确的连接条件

 **分类：**

+ sql92标准：内连接（等值连接、非等值连接、自连接）
+ sql99标准：内连接、外连接（左外、右外、全外（mysql不支持全外）、交叉连接）、自然连接

#### 等值连接（simple join 或者 inner join）

基于多个表中某个列的值的相等性作为连接条件，一般会用某个表外键去连接另一个表主键

等值连接特点：

+ 多表等值连接的结果为多表的交集部分
+ n个表连接，至少需要n-1个连接条件
+ 多个表不分主次，没有顺序要求
+ 一般为表起别名，提高阅读性和性能
+ 可以搭配排序、分组、筛选......等子句使用

```sql
select子句指定要返回的列名，因为多个表可能有重名字段，一般table1.column1或table1 column1这种形式表示
from子句指定数据库访问的多个表
where子句指定如何被连接 等值连接: emp1.id1 = emp2.id2

// 限制不明确列名
在多表中使用表前缀限制修饰列名
用表前缀改善性能
用列别名区别有相同名称，但在不同表中的列
// 使用表别名
使用表别名简化查询
使用表别名改善性能

// 示例
select d.depart_name
from employee e,departments d
where e.depart_id = d.depart_id and last_name = 'king';

```

#### 非等值连接

不等同于等值操作的连接条件

```sql
select d.depart_name
from employee e,departments d
where e.salary> d.income
```

#### 自连接

连接一个表不同的列。比如员工和直系上司都是雇员在雇员表中，如果要找到每个雇员的上司信息，则需要新建一个manager表连接到自己或者执行一个自连接

 自连接时因为用同一个表，表别名就很重要（相当于当成两张表处理）

```sql
SELECT worker.last_name w,manager.last_name m
FROM employees worker, employees manager
WHERE worker.manager_id = manager.employee_id
```

#### 交叉连接（CROSS JOIN）

交叉连接时书写笛卡尔乘积的一种方式，一般不会用。

假设A表20行数据，B表有100行数据。

笛卡尔乘积或者交叉连接会得到20*100行数据

+ CROSS JOIN子句导致两个表的交叉乘积
+ 该连接和两个表之间的笛卡尔乘积是一样的

```sql
select * from table1 cross join table2;
```

#### 自然连接（NATURAL JOIN）

连接只能发生在两个表中有相同名字和数据类型的列上。如果列有相同的名字，但数据类型不同，自然连接语法会报错。

自然连接也可以用等值连接书写，实际应用中等值连接用的比较多，因为等值连接没有自然连接的这些限制条件。

```sql
// 假设 departments表和locations表中都有loc_id列且数据类型相同
SELECT loc_id,citi
FROM departments
NATURAL JOIN locations;
```

#### SQL99中的内连接（INNER JOIN）

语法：

+ SELECT 查询列表
+ FROM 表1 别名
+ INNER JOIN 链接表（INNER关键字可省略）
+ ON 连接条件

```sql
SELECT e.emp_id,e.last_name,e.dep_id,d.loc_id
FROM emp e
JOIN dep d
ON e.dep_id = d.dep_id  // 如果还有其他条件后面加WHERE子句
WHERE ...
```

#### 外连接（OUTER JOIN）

**内连接与外连接**

+ 在SQL99中，连接两个表，仅返回匹配的行的连接，称为内连接
+ 在两个表之间的连接，返回内连接的结果，同时还返回不匹配行的左/右表的连接，称为左/右外连接
+ 在两个表之间的连接，返回内连接的结果，同时还返回左和右连接，称为全外连接

**孤儿数据（Orphan Data）**

孤儿数据是指被连接的列的值为空（不匹配）的数据。

```sql
// 左外连接  --- OUTER可以省略
SELECT e.last_name,d.department_name
FROM employees e   //左表
LEFT OUTER JOIN departments d
ON e.dept_id = d.department_id
WHERE ...;

// 右外连接 --- OUTER可以省略
SELECT e.last_name,d.department_name
FROM employees e   //左表
RIGHT OUTER JOIN departments d
ON e.dept_id = d.department_id
WHERE ...;

// 全外连接（FULL OUTER JOIN） --- MySQL中不支持

可以使用UNION实现全外连接
UNION: 可以将两个查询结果集合并，返回的行都是唯一的，并且会自动剔除返回中的重复数据
UNION ALL: 只是将两个查询结果合并后就返回，不会剔除重复数据。
语法：
(SELECT ... FROM ... LEFT JOIN ... ON ...)
UNION
(SELECT ... FROM ... RIGHT JOIN ... ON ...)

(SELECT e.last_name,d.department_name
FROM employees e
LEFT OUTER JOIN departments d
ON e.dept_id = d.department_id
WHERE ...)
UNION
(SELECT e.last_name,d.department_name
FROM employees e
RIGHT OUTER JOIN departments d
ON e.dept_id = d.department_id
WHERE ...);
```

### 子查询(内查询)

子查询是一个SELECT语句，它是嵌在另一个SELECT语句中的子句。使用子查询可以用简单的语句构建功能强大的语句。

+ 子查询在主查询之前执行一次
+ 子查询的结果被用于主查询

可以将子查询放到许多的SQL子句中，包括：

+ WHERE
+ HAVING
+ FROM

使用子查询的原则：
- 子查询放到括号中
- 将子查询放在比较条件的右边
- 在单行子查询中用单行运算符，在多行子查询中用多行运算符

子查询分类：

+ 单行子查询
  + 仅返回一行
  + 使用单行比较符（>,=,>=,<,<=,<>）
+ 多行子查询
  + 返回多于一行
  + 使用多行比较符比较（IN,ANY,ALL）

```sql
比如：查询谁的薪水比小红多？
主查询（外查询）：哪些雇员工资高于小红？
子查询：小红的薪水是多少？

SELECT last_name
FROM employees
WHERE salary > 
(SELECT salary
FROM employees
WHERE last_name = '小红');

// 多行子查询

- < ANY 小于最大值， > ANY 大于最小值
- < ALL 小于最小值， > ALL 大于最大值
- IN, NOT IN
SELECT last_name,salary
FROM employees
WHERE salary > ANY
(SELECT salary
FROM employees
WHERE job_id = 'IT');
```

### MySQL分页查询

查询原则：

+ 在MySQL数据库中使用LIMIT 子句进行分页查询
+ MySQL分页中开始位置为0
+ 分页子句在查询语句的最后

```sql
// LIMIT子句

SELECT ...
FROM ...
WHERE ...
ORDER BY ...
LIMIT 开始位置，查询数量;

// LIMIT OFFSET子句

SELECT ...
FROM ...
WHERE ...
ORDER BY ...
LIMIT 查询数量 OFFSET 开始位置;


```



### 索引

索引是对数据库表中的一列或者多列值进行排序的一种结构，使用索引可以快速访问数据库表中的特定信息。索引是一种特殊的文件，记录着数据表里所有记录的位置信息。索引可以大大提高MySQL的检索速度。

优点：

+ 通过创建唯一性索引，可以保证数据表中的每一行数据的唯一性
+ 加快数据检索速度
+ 减速表与表之间的连接
+ 在使用分组和排序进行检索的时候，可以减少查询中分组和排序的时间

缺点：

+ 创建索引和维护索引需要耗费时间，这种时间随着数据量的增加而增加
+ 索引需要占用物理空间，数据量越大，占用空间越大
+ 会降低表的增删改的效率，因为每次增删改索引都需要进行动态维护

什么时候需要创建索引

+ 频繁作为查询条件的字段
+ 查询中排序的字段创建索引将大大提高排序的速度
+ 查询中统计或者分组的字段

什么时候不需要创建索引

+ 频繁更新的字段
+ where条件里用不到的字段
+ 表记录太少，不需要创建索引
+ 经常增删改的表
+ 数据重复且平均分布的字段。因为数据包含大量重复数据，索引就没有太大效果。比如性别字段，只有男和女，不适合建立索引

mysql中的索引类型

+ 普通索引

  最基本索引，没有任何限制。

+ 唯一索引

  索引列的值必须唯一，但允许有空值，如果是组合索引，则列值的组合必须唯一

+ 主键索引

  特殊的索引，唯一标识一条记录，不能为空，一般用primary key来约束

+ 联合索引

  在多个字段上建立索引

```sql
普通索引，没有任何限制。在创建索引时，可以指定索引长度。length为可选参数，表示索引的长度，只有字符串类型的字段才能指定索引长度，如果是BLOB和TEXT类型，必须指定length。如果指定单列索引长度，length必须小于这个字段所允许的最大字符个数。

// 查询索引
SHOW INDEX FROM 表名;
// DDL创建索引
CREATE INDEX index_name ON 表名(列名(length));
// 修改表添加索引
ALTER TABLE 表名 ADD INDEX inde_name(列名([length]))
// 创建表时指定索引列
CREATE TABLE 表名(列名 类型 PRIMARY KEY(列名),..., INDEX index_name(列名[length]));

------------------

唯一索引与普通索引类似，不同的是：索引列的值必须唯一，但允许有空值，如果为某个列分配唯一性约束，那么创建索引就自带唯一索引了。

为不带唯一性约束的列添加唯一索引

// 创建唯一索引 (如果列有重复数据，会报错)
CREATE UNIQUE INDEX index_name ON 表名(列名(length));
// 修改表添加唯一索引
ALTER TABLE 表名 ADD UNIQUE inde_name(列名([length]))
// 创建表时指定唯一索引列
CREATE TABLE 表名(列名 类型 ... UNIQUE index_name(列名[length]));

....................

主键索引是一种特殊的唯一索引，一个表只能有一个主键，不允许有空值。一般是在建表的时候同时创建主键索引。创建了主键约束会自动生成主键索引。不允许为非主键列创建主键索引。主键自带索引，所以如果能用主键做条件判断就用主键。

// 修改表添加主键索引
ALTER TABLE 表名 ADD PRIMARY KEY(列名);
// 创建表时指定主键索引列
CREATE TABLE 表名(列名 类型 PRIMARY KEY AUTO_INCREMENT);

......................

组合索引是指为多个字段创建的索引，只有在查询条件使用了创建索引时的第一个字段，索引才会被使用（最左前缀原则）

// 添加组合索引
ALTER TABLE 表名 ADD INDEX inde_name(列名([length]),列名([length]))
alter table emp add index emp_index_name_address(name,address)
// 创建表时创建组合索引
CREATE TABLE 表名(列1 类型,列2 类型,INDEX index_name(列1,列2));

```

### MySQL事务（Transaction）

#### 事务简介

事务是指作为单个逻辑工作单元执行的一系列操作，要么完全地执行，要么完全地不执行。

+ 事务是一个最小的不可再分的工作单元；通常一个事务对应一个完整的业务（例如银行账户转账业务，该业务就是一个最小的工作单元）
+ 一个完整的业务需要批量的DML(insert、update、delete)语句共同联合完成
+ 事务只和DML语句有关，或者说DML语句才有事务。这个和业务逻辑有关，业务逻辑不同，DML语句的个数不同。

#### 事务四大特征（ACID）

+ 原子性（ATOMICITY）

  事务中的操作要么都不做，要么就全做

+ 一致性（CONSISTENCY)

  一个事务应该保护所有定义在数据上的不变的属性（例如完整性约束）。在完成一个成功的事务之后，数据应处于一致的状态。

+ 隔离性（ISOLATION）

  一个事务的执行不能被其他事务干扰

+ 持久性（DURABILITY）

  一个事务一旦提交，它对数据库中数据的改变就应该是永久性的。

#### 事务类型

+ 显示事务

  需要我们手动的提交或回滚。

  DML语言中的所有操作都是显示事务操作。

+ 隐式事务

  数据库自动提交不需要我们做任何处理，同时也不具备回滚行。DDL、DCL语言都是隐式事务操作

#### 使用事务

| TCL语句           | 描述     |
| ----------------- | -------- |
| start transaction | 事务开启 |
| commit            | 事务提交 |
| rollback          | 事务回滚 |

```sql
示例1：创建account账户表，包含id,卡号,用户名,余额.

create table account(
id int primary key auto_increment,
cardnum varchar(20) not null,
username varchar(30) not null,
balance double(10,2)
);

示例2：向account表中插入两条数据

insert into account(cardnum,username,balance) values('123456789','张三',2000);
insert into account(cardnum,username,balance) values('987654321','李四',2000);

// 示例3：在一个事务中完成转账操作

start transaction ---开启事务
update account set balance = balance-200 where cardnum = '123456789';
update account set balance = balance+200 where cardnum = '987654321';
commit;   --- 提交事务

// 回滚必须在事务提交之前
```

#### 事务的并发问题

+ 脏读（读取未提交数据）

  指一个事务读取了另外一个事务未提交的数据

  A事务读取B事务尚未提交的数据，此时如果B事务发生错误并执行回滚操作，那么A事务读取到的数据就是脏数据。

+ 不可重复性问题（前后多次读取，数据内容不一致）

+ 幻读（前后多次读取，数据总量不一致）

#### 事务的隔离级别

MySQL中提供四种隔离级别来解决上述问题

| 隔离级别/读异常              | 脏读 | 不可重复度 | 幻读 | 隔离级别 |
| ---------------------------- | ---- | ---------- | ---- | -------- |
| READ UNCOMMITTED             | N    | N          | N    | 最低     |
| READ COMMITTED               | Y    | N          | N    | 较低     |
| REPEATABLE READ（mysql默认） | Y    | Y          | N    | 较高     |
| SERIALIZABLE                 | Y    | Y          | Y    | 最高     |

> Y表示解决 N表示未解决

```sql
// 查看mysql默认事务隔离级别
SELECT @@transaction isolation;

// 设置事务隔离级别 
对当前session有效
set session transaction isolation level read uncommitted;

// 其他比如spring框架可以针对某些方法做事务隔离，更细粒度
```

### MySQL的用户管理

MySQL是一个多用户的数据库系统，按权限，用户可以分为两种：root用户，超级管理员和由root用户创建的普通用户

#### 用户管理

```sql
// 创建用户 
CREATE USER username IDENTIFIED BY 'password';

// 查看用户
SELECT USER,HOST FROM mysql.user;

// 权限管理  -- 新用户创建完成后，需要分配权限
GRANT 权限 ON 数据库.表 TO 用户名@登录主机 IDENTIFIED BY '密码'

登录主机：
%			匹配所有主机
localhost	 只能连接本机
127.0.0.1	 只能连接这一ip
::1			 兼容支持ipv6,表示ipv4的127.0.0.1

权限列表
all
...

// 示例，给这个用户所有库所有表所有权限
GRANT ALL PRIVILEGES ON *.* TO 'username'@'localhost' IDENTIFIED BY 'password';

// 刷新权限   --- 调整权限之后，执行刷新
FLUSH PRIVILEGES;

// 删除用户
DROP USER username@localhost;
```
