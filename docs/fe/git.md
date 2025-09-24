# Git基础

## 1. git基本工作流图解

![工作流](/workflow.png)

## 2. Git 常用命令

### 2.1 初始化项目

```bash
# 若远程已存在项目，克隆项目到本地(会自动init，fetch等)
git clone <repo_url>

# 若本地项目同步到远程，且远程没有对应仓库，要先在github上创建对应仓库

    # 若本地新建项目，还未初始化，先初始化本地仓库，创建工作区目录下对所有文件的管理
    git init
    # 将分支名修改为main
    git branch -M main
    # 绑定本地和远程仓库
    git remote add origin <url>

    # 若本地项目已初始化，绑定本地和远程仓库
    git remote add origin <repo_url>
    git branch -M main
    # 绑定本地和远程的main分支
    git push -u origin main
   
```

### 2.2 修改和提交

```bash
# 我们修改代码之后，默认是已修改或者未被追踪（添加、删除文件）状态【已修改】   

# 将已修改或者未被追踪文件（部分或所有）添加到暂存区，进入staged状态【已暂存】
git add <file>
git add .

# 暂存区代码提交到本地仓库，进入committed状态【已提交】
git commit -m "提交说明"
git commit --amend -m "修改提交说明"
```

### 2.3 拉取和推送

```bash
# 获取远程最新变更，此时代码没有同步到工作区！！
git fetch origin 

# 相当于git fetch orgin <branch> + git merge origin <branch>
git pull origin <branch> 
# 若git push发现远程有新代码还没有同步到本地,可以运行这个，git log时会去除多余的merge commit记录
git pull --rebase origin <branch>

git push origin <branch>
# 将本地分支和远程进行关联，之后可以直接git push
git push -u(--set-upstream) origin <branch
```

### 2.4 分支管理

```bash
# 列出本地所有分支
git branch
# 创建新分支
git branch <branch_name>
# 删除本地分支，如果本地分支有修改还未merge，不允许删除
git branch -d <branch_name>
# 强制删除本地分支
git branch -D <branch_name>
*注：-r 远程； -a 本地和远程；-f 强制 *

# 切换到某分支
git checkout <branch_name>
#新建分支并且切换到此分支
git checkout -b <branch_name>

# 合并<branch>代码到当前分支
git merge <branch>
```

------

### 2.5 撤销与恢复

![指向示例](/headArrow.png)

```bash
# 如图示，head指向当前分支下最新一次提交，且每次提交都有对应commitId

# 将HEAD中的文件内容替换掉工作区文件内容，已暂存不受影响
git checkout -- <file>
# 软重置，将HEAD移动至指定提交处，但这次提交之后的修改依然会保留
git reset --soft HEAD^(或某次commitId)
# 硬重置，将HEAD移动至指定提交处，但这次提交之后的修改不会保留
git reset --hard HEAD^(或某次commitId)
*假设撤销之前已经push到远程，撤销之后git push会发生错误，本地版本比远程低，则git push -f 强制提交*

# 生成一次新的提交，并撤销某次提交的内容，此时HEAD指向新提交
git revert <commitId>
# 假设main分支想合并dev中间的某几次提交，可以在main分支直接操作
git cherry-pick <commitId1> <commitI2> <commitId3>  ...
# 会合并commitId1到commitId2之间所有提交。如果是commitId1..commitId2则不包含commitId1
git cherry-pick commitId1^..commitId2

# 可以显示提交过的记录，不包括git reset删除后的
git log
# 简洁输出为一行
git log --oneline
# 显示所有提交过的记录，包括被删除的
git reflog
```

------

### 2.6 标签管理（Tag）

```bash
# tag作用可以标记部署版本，便于版本查找和管理

# 打标签，默认打标签到HEAD指向commit
git tag v1.0.0                         	   			# 轻量标签
git tag -a v1.0.0 -m "版本说明"          			 # 附注标签
git tag -a v1.0.0 <commitId> -m "版本说明"           # 打标签到某个commit

# 查看标签
git tag                                 # 查看标签
git show v1.0.0                         # 查看标签详情

# 推送标签
git push origin v1.0.0                  # 推送单个标签
git push origin --tags                  # 推送所有标签

# 删除标签
git tag -d v1.0.0                       # 删除本地标签
git push origin :refs/tags/v1.0.0       # 删除远程标签

# 切换到某个标签代码状态
git checkout <tagname>
```
