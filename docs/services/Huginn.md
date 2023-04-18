---
article: false
title: Huginn
icon: customize
order: 2
---

- Huginn 部署：查看 [deploy Huginn inside of Docker](https://github.com/huginn/huginn/blob/master/doc/docker/install.md) 和 [.env 设置](https://github.com/huginn/huginn/blob/master/.env.example)，或按下方的教程手动部署到服务器上，轻量使用推荐部署到 Docker。
- Huginn 抓取教程：[RSS 进阶篇：Huginn - 真·为任意网页定制 RSS 源（PhantomJs 抓取）](https://newzone.top/posts/2018-10-07-huginn_scraping_any_website.html)

## 常用 Agent

[Huginn Agents](https://github.com/huginn/huginn/wiki/Agent-Types-&-Descriptions)：

- Website Agent 解析网页、XML 文档和 json 数据，最常使用
- Event Formatting Agent 事件信息格式化，可以对收到的信息内容进行格式化，允许添加自定义新内容
- Phantom Js Cloud Agent 借助 Phantom 抓取动态页面源码，防止部门网站屏蔽爬虫
- Trigger Agent 监控事件反馈信息的触发器，多用来过滤部分内容
- De Duplicate Agent 去重

- Data Output Agent 将数据以 RSS 和 Json 的形式向外部推送
- Liquid Output Agent 自定义格式数据输出，可以用它创建 HTML 页面，json 数据等

- Webhook Agent
- Javascript Agent 允许执行自定义的 JS 代码，可以用于个性化操作
- Digest Agent 汇总节点，收集所有收到的事件再作为一个事件发送出去
- Post Agent 可以由其他节点触发，根据固定模板合并事件信息，并以 POST 或 GET 方式向指定的 URL 发起请求
- Delay Agent 可以作为事件或者副本的暂存器或者缓冲区，统一触发发布
- Scheduler Agent 定时器节点

- Attribute Difference Agent 数值差异比较
- Commander Agent 触发器代理，可以用于向其他节点发起指令控制，控制节点的执行和停止等

{{created_at}} 为自带抓取时间，Agent 设置中的特殊字符`+`，需要用反义符`\\`。

## Huginn 部署

Huginn 任务有时会被卡住，后续任务都无法进行。原本使用官方 Docker 镜像，但重启容器无法解决任务卡住的问题。因此，改为手动部署 Huginn，定期使用重置命令防止任务卡住。

```bash
cd /home/huginn/huginn
sudo bundle exec rake production:force_stop
sudo bundle exec rake production:export
```

部署步骤记录在下方，但还有 3 个**待解决问题**：

- 定期导出数据库到本地。
- 测试任务卡住后，rake production:export 是否有效。
- 开机启动 Huginn 服务，可在 Docker 容器终端机中执行。`production:export` 步骤会提示 `unable to lock supervise/lock: temporary failure`，但此报错似乎不影响 Huginn 的运行，等有时间看看是否有相关报错。

  ```bash
  sudo service mysql restart
  sudo service nginx restart
  cd /home/huginn/huginn
  git config --global --add safe.directory /home/huginn/huginn
  sudo runsvdir /etc/service &
  sudo bundle exec rake production:export
  ```

### Ubuntu 手动部署

部署环境：Ubuntu 18.04 的 Docker 镜像（同样适用于服务器）
安装参考：[Manual Installation on Debian/Ubuntu](https://github.com/huginn/huginn/blob/master/doc/manual/installation.md)，[Novice-setup-guide](https://github.com/huginn/huginn/wiki/Novice-setup-guide)
手动升级：[manual Update](https://github.com/huginn/huginn/blob/master/doc/manual/update.md)

Huginn 部署步骤：

```bash
# 进入 huginn 容器命令行，某些容器命令为 /bin/bash
sudo docker exec -it huginn bash
# run as root!
apt-get update -y
apt-get upgrade -y
apt-get install sudo -y

# Install vim and set as default editor
sudo apt-get install -y vim
sudo update-alternatives --set editor /usr/bin/vim.basic

# Install the required packages
sudo apt-get install -y runit build-essential git zlib1g-dev libyaml-dev libssl-dev libgdbm-dev libreadline-dev libncurses5-dev libffi-dev curl openssh-server checkinstall libxml2-dev libxslt-dev libcurl4-openssl-dev libicu-dev logrotate python-docutils pkg-config cmake nodejs graphviz jq shared-mime-info

# Ubuntu 18.04 Bionic
sudo apt-get install -y runit-systemd

# Download Ruby and compile it:
mkdir /tmp/ruby && cd /tmp/ruby
curl -L --progress-bar https://cache.ruby-lang.org/pub/ruby/2.7/ruby-2.7.7.tar.bz2 | tar xj
cd ruby-2.7.7
./configure --disable-install-rdoc
make -j`nproc`
sudo make install

sudo gem update --system --no-document
sudo gem install foreman --no-document

# Create a user for Huginn:
sudo adduser --disabled-login --gecos 'Huginn' huginn

# Install the database packages
sudo apt-get install -y mysql-server mysql-client libmysqlclient-dev
```

输入 `service mysql start` 启动数据库，否则下一步数据库设置容易报错 `Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock'`。^[[ERROR 2002 (HY000)](https://blog.csdn.net/qq_36822217/article/details/103156327)]

```bash
# 逐步设置数据库 root 密码
sudo mysql_secure_installation

# 用上方设置的密码登陆数据库
mysql -u root -p

# 逐行输入代码到数据库命令行 `mysql>`，需将 `$password` 替换为你要设置的密码
CREATE USER 'huginn'@'localhost' IDENTIFIED BY '$password';
SET default_storage_engine=INNODB;
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, LOCK TABLES ON `huginn_production`.* TO 'huginn'@'localhost';
FLUSH PRIVILEGES;
\q
```

数据库设置好后，拉取 huginn 主体程序，此段命令可以整段复制到 ssh。

```bash
# We'll install Huginn into the home directory of the user "huginn"
cd /home/huginn

# Clone Huginn repository
sudo -u huginn -H git clone https://github.com/huginn/huginn.git -b master huginn

# Go to Huginn installation folder
cd /home/huginn/huginn

# Copy the example Huginn config
sudo -u huginn -H cp .env.example .env

# Create the log/, tmp/pids/ and tmp/sockets/ directories
sudo -u huginn mkdir -p log tmp/pids tmp/sockets

# Make sure Huginn can write to the log/ and tmp/ directories
sudo chown -R huginn log/ tmp/
sudo chmod -R u+rwX,go-w log/ tmp/

# Make sure permissions are set correctly
sudo chmod -R u+rwX,go-w log/
sudo chmod -R u+rwX tmp/
sudo -u huginn -H chmod o-rwx .env

# Copy the example Unicorn config
sudo -u huginn -H cp config/unicorn.rb.example config/unicorn.rb
```

`sudo -u huginn -H editor .env` 设置 huginn 环境依赖，更多选项查看 [.env 设置案例](https://github.com/huginn/huginn/blob/master/.env.example)。编辑器为上面安装的 vim，`i` 在光标所在的位置插入，`esc` 退出编辑，`:wq` 保存并退出。

```bash
DATABASE_ADAPTER=mysql2
#DATABASE_ENCODING=utf8   # 修改点
DATABASE_RECONNECT=true
DATABASE_NAME=huginn_production  # 修改点
DATABASE_POOL=20
DATABASE_USERNAME=huginn   # 修改点
DATABASE_PASSWORD='$password' # 修改点，换为你自己的密码
#DATABASE_HOST=your-domain-here.com
#DATABASE_PORT=3306
#DATABASE_SOCKET=/tmp/mysql.sock

# MySQL only: If you are running a MySQL server >=5.5.3, you should
# set DATABASE_ENCODING to utf8mb4 instead of utf8 so that the
# database can hold 4-byte UTF-8 characters like emoji.
DATABASE_ENCODING=utf8mb4  #修改点

...
RAILS_ENV=production  # 修改点

USE_GRAPHVIZ_DOT=dot # 取消注释，启用 GRAPHVIZ 来生成 diagram

DEFAULT_HTTP_USER_AGENT="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36" # 浏览器访问

TIMEZONE="CST (China Standard Time)" # 时区需按指定格式填写，否则会报错 runsv not running
```

Install Gems 前用子账户重新设置运行目录权限 `sudo chown -R huginn:huginn /home/huginn`，防止报错 `Your user account isn't allowed to install to the system RubyGems`。

```bash
# 注意看黄字警告
gem install bundler
# Docker 环境中，时区容易丢失
apt-get install tzdata
# Install Gems
sudo -u huginn -H bundle config set deployment 'true'
sudo -u huginn -H bundle config set without 'development test'
sudo -u huginn -H bundle install
# 备用 Gems 修复命令
# bundle update
# gem update bundler
# vim /home/huginn/huginn/Gemfile

# Initialize Database
# Create the database
sudo -u huginn -H bundle exec rake db:create RAILS_ENV=production

# Migrate to the latest version
sudo -u huginn -H bundle exec rake db:migrate RAILS_ENV=production

# 设置登陆账户密码，Create admin user and example agents using the default admin/password login
sudo -u huginn -H bundle exec rake db:seed RAILS_ENV=production SEED_USERNAME=admin SEED_PASSWORD=password

# Compile Assets
sudo -u huginn -H bundle exec rake assets:precompile RAILS_ENV=production
```

`sudo -u huginn -H editor Procfile` 修改 huginn 设置。

```bash
# 在下两行前，添加符号「#」
#web: bundle exec rails server -p ${PORT-3000} -b ${IP-0.0.0.0}
#jobs: bundle exec rails runner bin/threaded.rb

# 删除以下下两行前的符号「#」
web: bundle exec unicorn -c config/unicorn.rb
jobs: bundle exec rails runner bin/threaded.rb
```

`'sv stop huginn-web-1' exited with a non-zero return value: fail: huginn-web-1: runsv not running` 的报错，使用 `foreman export runit -a huginn -l /home/huginn/huginn/log /etc/service` 和 `chown -R huginn:huginn /etc/service/huginn*`。^[[rake export hangs](https://github.com/huginn/huginn/issues/2410)] ^[[Huginn failed to restart after installed node and systemd](https://github.com/huginn/huginn/issues/1618)] 如果是重启 Huginn 时出现此报错，则检查 `sudo -u huginn -H editor .env` 设置。

```bash
# 切换到
cd /home/huginn/huginn
# 设置
git config --global --add safe.directory /home/huginn/huginn
# 设置开机启动
sudo runsvdir /etc/service &
sudo bundle exec rake production:export

# Setup Logrotate
sudo cp deployment/logrotate/huginn /etc/logrotate.d/huginn

# Ensure Your Huginn Instance Is Running
sudo bundle exec rake production:status
```

Nginx 站点设置：

```bash
sudo apt-get install -y nginx

# Site Configuration
sudo cp deployment/nginx/huginn /etc/nginx/sites-available/huginn
sudo ln -s /etc/nginx/sites-available/huginn /etc/nginx/sites-enabled/huginn

# Change YOUR_SERVER_FQDN to the fully-qualified domain name of your host serving Huginn.
sudo editor /etc/nginx/sites-available/huginn

# 不需要 https，则改为下方配置
server {
  listen 80; # 监听的端⼝
  server_name localhost home.newzone.top; # 域名或ip，这里启用了两个地址，用空格分开

# 测试设置是否正确
sudo nginx -t

# 移除默认网站设置，只有当服务器/容器只存在 Huginn 网站方执行下行命令
sudo rm /etc/nginx/sites-enabled/default
```

以上完成了 Huginn 的所有部署。

### Huginn Docker

Huginn [multi-process](https://github.com/huginn/huginn/tree/master/docker/multi-process) 镜像基于 Ubuntu 18.04，没有 root 权限。如果不导出卷，或者使用单独的数据库容器，则无法在不丢失数据的情况下更新 Huginn。

此外，官方镜像路径与手动版不同，不支持 force_stop 命令。官方建议 Docker 中使用下方命令删除数据库中卡住的任务。这个命令实测是有效的，但我有次碰到了未知 bug，卡住的任务被删除，后续任务却没继续。

```bash
# get a shell inside the docker container (replace huginn with the name or id of the container)
sudo docker exec -it huginn /bin/bash

# source the environment file
source .env

# get a rails console
bundle exec rails console

# inside the rails console delete  the job
Delayed::Job.where('locked_at IS NOT NULL AND locked_by IS NOT NULL AND failed_at IS NULL').destroy_all
```

## Agents

### Trigger Agent

Trigger Agent 挑选符合条件的事件。

```yml
# content 字段中不包含 周雅萌 或 邓雅萌
{
  "expected_receive_period_in_days": "2",
  "keep_event": "true",
  "rules": [
    {
      "type": "!regex",
      "value": "周雅萌 | 邓雅萌",
      "path": "$.content"
    }
  ],
  "message": "Looks like your pattern matched in '{{value}}'!"
}

# title 中包含品牌词 iluminage 或 易美肌
{
  "expected_receive_period_in_days": "4",
  "keep_event": "true",
  "rules": [
    {
      "type": "regex",
      "value": "iluminage|易美肌",
      "path": "$.title"
    }
  ],
  "message": "Looks like your pattern matched in '{{value}}'!"
}
```

### Liquid Output Agent

用自定义模板将数据整理，输出为 HTML，json 和 xml 格式链接。

模式一般选 `Last X events`，将接收到的所有数据对外输出，默认为 1000。

`Last X events` 模式下，可以设置 `Event limit` 以控制输出数据的数量和时间段。`Event limit` 可以设为 100，即输出数据为 100；也可以设为「1 day」或「5 minutes」，即仅输出最近一天的内容。

### Event Formatting Agent

Event Formatting Agent 允许您格式化传入的事件，根据需要添加新的字段。可以用正则来替换输入中的某些元素。具体样例参考，[新京报 #5 清理版面字段格式](http://huginnio.herokuapp.com/scenarios/14/download)。

```yml
# strftime() 方法中常用的占位符
# %Y 表示年份，%m 表示月份，%d 表示日期，%H 表示小时（24小时制），%M 表示分钟，%S 表示秒，%B 代表英文的月份，`%I` 代表小时（12小时制），`%p` 代表 AM/PM。`%e` 代表日期，不会在首位添加零。
"created_at": "{{created_at | date:'%Y-%m-%d'}}"

# 将 2023-03-02 23:33:30 +0800 替换为 2023-03-02
"created_at": "{{created_at | regex_replace: ' ', ''| regex_replace: '(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?', ''| regex_replace: '\\+0800', ''}}"
```

#### 正则重构

比如生成时间规则为 `"created_at": "{{created_at}}"`，默认时间 `2022-07-06 21:09:51 +0800`，使用正则删除规则为
`"created_at": "{{created_at | regex_replace: ' ', ''| regex_replace: '(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?', ''| regex_replace: '\\+0800', ''}}"`。

#### 加前后缀

抓取链接不完整时，需要完善链接，比如 `"url_link": "https://so.toutiao.com{{temp_link}}"`。

For example, here is a possible Event:

```yml
{
  "high": { "celsius": "18", "fahreinheit": "64" },
  "date":
    { "epoch": "1357959600", "pretty": "10:00 PM EST on January 11, 2013" },
  "conditions": "Rain showers",
  "data": "This is some data",
}
```

You may want to send this event to another Agent, for example a Twilio Agent, which expects a `message` key. You can use an Event Formatting Agent's `instructions` setting to do this in the following way:

```json
"instructions": {
  "message": "Today's conditions look like {{conditions}} with a high temperature of {{high.celsius}} degrees Celsius.",
  "subject": "{{data}}",
  "created_at": "{{created_at}}"
}
```

Names here like `conditions`, `high` and `data` refer to the corresponding values in the Event hash.

The special key `created_at` refers to the timestamp of the Event, which can be reformatted by the `date` filter, like `{{created_at | date:"at %I:%M %p" }}`.

The upstream agent of each received event is accessible via the key `agent`, which has the following attributes: `name`, `options`, `sources`, `type`, `url`, `id`, `disabled`, `memory`, `controllers`, `schedule`, `keep_events_for`, `propagate_immediately`, `working`, `receivers`, `control_targets`.

Have a look at the [Wiki](https://github.com/huginn/huginn/wiki/Formatting-Events-using-Liquid) to learn more about liquid templating.

Events generated by this possible Event Formatting Agent will look like:

```json
{
  "message": "Today's conditions look like Rain showers with a high temperature of 18 degrees Celsius.",
  "subject": "This is some data"
}
```

In `matchers` setting you can perform regular expression matching against contents of events and expand the match data for use in `instructions` setting. Here is an example:

```json
{
  "matchers": [
    {
      "path": "{{date.pretty}}",
      "regexp": "A(?<time>dd:dd [AP]M [A-Z]+)",
      "to": "pretty_date"
    }
  ]
}
```

This virtually merges the following hash into the original event hash:

```json
"pretty_date": {
  "time": "10:00 PM EST",
  "0": "10:00 PM EST on January 11, 2013"
  "1": "10:00 PM EST"
}

```

So you can use it in `instructions` like this:

```json
"instructions": {
  "message": "Today's conditions look like {{conditions}} with a high temperature of {{high.celsius}} degrees Celsius according to the forecast at {{pretty_date.time}}.",
  "subject": "{{data}}"
}

```

If you want to retain original contents of events and only add new keys, then set `mode` to `merge`, otherwise set it to `clean`.

To CGI escape output (for example when creating a link), use the Liquid `uri_escape` filter, like so:

```json
{
  "message": "A peak was on Twitter in {{group_by}}.  Search: https://twitter.com/search?q={{group_by | uri_escape}}"
}
```

---

### Adioso Agent - 机票价格追踪

`Creates events`

Adioso Agent 可以查询两个城市间，在指定时间内的最低飞机票价格。机票价格货币是美元。查询日期 `start_date` 和 `end_date` 之间的差异需小于 150 天。需要注册 [Adioso](http://adioso.com/)，并在 `username` and `password` 中输入。

---

### Aftership Agent - 物流追踪-API 付费

`Creates events`

Aftership agent 帮助你追踪你的快递，并实时更新包裹动态。为了能够使用 Aftership API，您需要生成一个 `API Key`。这需要付费才能使用其跟踪功能。

操作说明：
Provide the `path` for the API endpoint that you’d like to hit. For example, for all active packages, enter `trackings` (see https://www.aftership.com/docs/api/4/trackings), for a specific package, use `trackings/SLUG/TRACKING_NUMBER` and replace `SLUG` with a courier code and `TRACKING_NUMBER` with the tracking number. You can request last checkpoint of a package by providing `last_checkpoint/SLUG/TRACKING_NUMBER` instead.

You can get a list of courier information here `https://www.aftership.com/courier`

Required Options:

- `api_key` - YOUR_API_KEY.
- `path request and its full path`

---

### Algorithmia Agent - AI 算法

`Creates events` `Receives events` `Dry runs`
[huginn_algorithmia_agent](http://huginnio.herokuapp.com/agent_gems#huginn_algorithmia_agent)

AlgoritmiaAgent 运行 Algorithmia 中的算法。在使用此代理之前，您需要注册一个[Algorithmia](https://algorithmia.com)帐户。

The created event will have the output from Algorithmia in the `result` key. To merge incoming Events with the result, use `merge` for the `mode` key.

---

### Attribute Difference Agent - 属性差异（待深入理解）

`Creates events` `Receives events`

The Attribute Difference Agent receives events and emits a new event with the difference or change of a specific attribute in comparison to the previous event received.
Attribute Difference Agent 用于传递两个不同值的差异和改变。

`path` specifies the JSON path of the attribute to be used from the event.

`output` specifies the new attribute name that will be created on the original payload and it will contain the difference or change.

`method` specifies if it should be…

- `percentage_change` eg. Previous value was `160`, new value is `116`. Percentage change is `-27.5`
- `decimal_difference` eg. Previous value was `5.5`, new value is `15.2`. Difference is `9.7`
- `integer_difference` eg. Previous value was `50`, new value is `40`. Difference is `-10`

`decimal_precision` defaults to `3`, but you can override this if you want.

`expected_update_period_in_days` is used to determine if the Agent is working.

The resulting event will be a copy of the received event with the difference or change added as an extra attribute. If you use the `percentage_change` the attribute will be formatted as such `{{attribute}}_change`, otherwise it will be `{{attribute}}_diff`.

All configuration options will be liquid interpolated based on the incoming event.

---

### ~~Basecamp Agent - Service 停用~~

`Creates events` `37signals`

The Basecamp Agent checks a Basecamp project for new Events

To be able to use this Agent you need to authenticate with 37signals in the [Services](http://huginnio.herokuapp.com/services) section first.

---

### Bigquery Agent - 大型数据库分析

`Creates events` `Receives events` `Dry runs`
[huginn_bigquery_agent](http://huginnio.herokuapp.com/agent_gems#huginn_bigquery_agent)

Bigquery Agent 会调用 Google BigQuery 和 Goolge Cloud 账户，可能需要付费。同时，Bigquery Agent 依靠服务帐户进行身份验证，而不是 oauth。

Setup:

1. Visit [the google api console](https://code.google.com/apis/console/b/0/)
2. Use your existing project (or create a new one)
3. APIs & Auth -> Enable BigQuery
4. Credentials -> Create new Client ID -> Service Account
5. Download the JSON keyfile and either save it to a path, ie: `/home/huginn/Huginn-5d12345678cd.json`, or copy the value of `private_key` from the file.
6. Grant that service account access to the BigQuery datasets and tables you want to query.

The JSON keyfile you downloaded earlier should look like this:

```json
{
  "type": "service_account",
  "project_id": "huginn-123123",
  "private_key_id": "6d6b476fc6ccdb31e0f171991e5528bb396ffbe4",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "huginn@huginn-123123.iam.gserviceaccount.com",
  "client_id": "123123...123123",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/huginn%40huginn-123123.iam.gserviceaccount.com"
}
```

Agent Configuration:

`project_id` - The id of the Google Cloud project.

`query` - The BigQuery query to run. [Liquid](https://github.com/cantino/huginn/wiki/Formatting-Events-using-Liquid) formatting is supported to run queries based on receiving events.

`use_legacy` - Whether or not to use BigQuery legacy SQL or standard SQL. (Defaults to `false`)

`max` - Maximum number of rows to return. Defaults to unlimited, but results are always [limited to 10 MB](https://googlecloudplatform.github.io/google-cloud-ruby/#/docs/google-cloud-bigquery/v0.27.0/google/cloud/bigquery/project).

`timeout` - How long to wait for query to complete (in ms). Defaults to `10000`.

`event_per_row` - Whether to create one Event per row returned, or one event with all rows as `results`. Defaults to `false`.

**Authorization**

`keyfile` - (String) The path (relative to where Huginn is running) to the JSON keyfile downloaded in step 5 above.

Alternately, `keyfile` can be a hash:

`keyfile` `private_key` - The private key (value of `private_key` from the downloaded file). [Liquid](https://github.com/cantino/huginn/wiki/Formatting-Events-using-Liquid) formatting is supported if you want to use a Credential. (E.g., `{% credential google-bigquery-key %}`)

`keyfile` `client_email` - The value of `client_email` from the downloaded file. Same as the service account email.

---

### ~~Boxcar Agent - iPhone 通知栏 app~~

`Receives events`

Boxcar agent 会在 iPhone 推送通知，但其不兼容于 iOS 10 系统，已经停止更新。

To be able to use the Boxcar end-user API, you need your `Access Token`. The access token is available on general “Settings” screen of Boxcar iOS app or from Boxcar Web Inbox settings page.

Please provide your access token in the `user_credentials` option. If you'd like to use a credential, set the `user_credentials` option to `{% credential CREDENTIAL_NAME %}`.

Options:

- `user_credentials` - Boxcar access token.
- `title` - Title of the message.
- `body` - Body of the message.
- `source_name` - Name of the source of the message. Set to `Huginn` by default.
- `icon_url` - URL to the icon.
- `sound` - Sound to be played for the notification. Set to ‘bird-1’ by default.

---

### Change Detector Agent - 监测数据变化

`Creates events` `Receives events`

The Change Detector Agent receives a stream of events and emits a new event when a property of the received event changes.
Change Detector Agent 会接收数据流内容，并在监测到数据属性改变后，传递出新事件。

`property` specifies a [Liquid](https://github.com/huginn/huginn/wiki/Formatting-Events-using-Liquid) template that expands to the property to be watched, where you can use a variable `last_property` for the last property value. If you want to detect a new lowest price, try this: `{% assign drop = last_property | minus: price %}{% if last_property == blank or drop > 0 %}{{ price | default: last_property }}{% else %}{{ last_property }}{% endif %}`

`expected_update_period_in_days` is used to determine if the Agent is working.

The resulting event will be a copy of the received event.

---

### Commander Agent - 触发命令

`Receives events` `Controls agents`

Commander Agent 由时间表或传入事件触发，并触发其他 agents 运行，禁用，配置或启用自己。

**Action types**

Set `action` to one of the action types below:

- `run`: Target Agents are run when this agent is triggered.

- `disable`: Target Agents are disabled (if not) when this agent is triggered.

- `enable`: Target Agents are enabled (if not) when this agent is triggered.

- `configure`: Target Agents have their options updated with the contents of `configure_options`.

Here's a tip: you can use [Liquid](https://github.com/huginn/huginn/wiki/Formatting-Events-using-Liquid) templating to dynamically determine the action type. For example:

- To create a CommanderAgent that receives an event from a WeatherAgent every morning to kick an agent flow that is only useful in a nice weather, try this: `{% if conditions contains 'Sunny' or conditions contains 'Cloudy' %}` `run{% endif %}`

- Likewise, if you have a scheduled agent flow specially crafted for rainy days, try this: `{% if conditions contains 'Rain' %}enable{% else %}disabled{% endif %}`

- If you want to update a WeatherAgent based on a UserLocationAgent, you could use `'action': 'configure'` and set 'configure*options' to `{ 'location': '{{\_location*.latlng}}' }`.

- In templating, you can use the variable `target` to refer to each target agent, which has the following attributes: `name`, `options`, `sources`, `type`, `url`, `id`, `disabled`, `memory`, `controllers`, `schedule`, `keep_events_for`, `propagate_immediately`, `working`, `receivers`, and `control_targets`.

**Targets**

Select Agents that you want to control from this CommanderAgent.

---

### Csv Agent - CSV 表格数据处理

`Creates events` `Receives events` `Consumes file pointer`

CsvAgent 可以解析或重构 CSV 表格数据。解析时，可以针对整个 CSV，也可以单独处理一行数据。

Set `mode` to `parse` to parse CSV from incoming event, when set to `serialize` the agent serilizes the data of events to CSV.

**Universal options**

Specify the `separator` which is used to seperate the fields from each other (default is `,`).

`data_key` sets the key which contains the serialized CSV or parsed CSV data in emitted events.

**Parsing**

If `use_fields` is set to a comma seperated string and the CSV file contains field headers the agent will only extract the specified fields.

`output` determines wheather one event per row is emitted or one event that includes all the rows.

Set `with_header` to `true` if first line of the CSV file are field names.

This agent can consume a ‘file pointer’ event from the following agents with no additional configuration: `FtpsiteAgent`, `LocalFileAgent`, `S3Agent`. Read more about the concept in the [wiki](https://github.com/huginn/huginn/wiki/How-Huginn-works-with-files).

When receiving the CSV data in a regular event use [JSONPath](http://goessner.net/articles/JsonPath/) to select the path in `data_path`. `data_path` is only used when the received event does not contain a 'file pointer'.

**Serializing**

If `use_fields` is set to a comma seperated string and the first received event has a object at the specified `data_path` the generated CSV will only include the given fields.

Set `with_header` to `true` to include a field header in the CSV.

Use [JSONPath](http://goessner.net/articles/JsonPath/) in `data_path` to select with part of the received events should be serialized.

---

### Data Output Agent - 网页输出数据（RSS）

`Receives events`

Data Output Agent 将传入的数据输入为 RSS 或 JSON，具体格式为“.xml”或“.json”。

This Agent will output data at:

`https:///users/1/web_requests/:id/:secret.xml`

where `:secret` is one of the allowed secrets specified in your options and the extension can be `xml` or `json`.

You can setup multiple secrets so that you can individually authorize external systems to access your Huginn data.

Options:

- `secrets` - An array of tokens that the requestor must provide for light-weight authentication.
- `expected_receive_period_in_days` - How often you expect data to be received by this Agent from other Agents.
- `template` - A JSON object representing a mapping between item output keys and incoming event values. Use [Liquid](https://github.com/huginn/huginn/wiki/Formatting-Events-using-Liquid) to format the values. Values of the `link`, `title`, `description` and `icon` keys will be put into the `<channel>` section of RSS output. Value of the `self` key will be used as URL for this feed itself, which is useful when you serve it via reverse proxy. The `item` key will be repeated for every Event. The `pubDate` key for each item will have the creation time of the Event unless given.
- `events_to_show` - The number of events to output in RSS or JSON. (default: `40`)
- `ttl` - A value for the `<ttl>` element in RSS output. (default: `60`)
- `ns_media` - Add [yahoo media namespace](https://en.wikipedia.org/wiki/Media_RSS) in output xml
- `ns_itunes` - Add [itunes compatible namespace](http://lists.apple.com/archives/syndication-dev/2005/Nov/msg00002.html) in output xml
- `rss_content_type` - Content-Type for RSS output (default: `application/rss+xml`)
- `response_headers` - An object with any custom response headers. (example: `{"Access-Control-Allow-Origin": "*"}`)
- `push_hubs` - Set to a list of PubSubHubbub endpoints you want to publish an update to every time this agent receives an event. (default: none) Popular hubs include [Superfeedr](https://pubsubhubbub.superfeedr.com/) and [Google](https://pubsubhubbub.appspot.com/). Note that publishing updates will make your feed URL known to the public, so if you want to keep it secret, set up a reverse proxy to serve your feed via a safe URL and specify it in `template.self`.

If you'd like to output RSS tags with attributes, such as `enclosure`, use something like the following in your `template`:

```json
"enclosure": {
  "_attributes": {
    "url": "{{media_url}}",
    "length": "1234456789",
    "type": "audio/mpeg"
  }
},
"another_tag": {
  "_attributes": {
    "key": "value",
    "another_key": "another_value"
  },
  "_contents": "tag contents (can be an object for nesting)"
}

```

**Ordering events**

To specify the order of events, set `events_order` to an array of sort keys, each of which looks like either `expression` or `[expression, type, descending]`, as described as follows:

- _expression_ is a Liquid template to generate a string to be used as sort key.

- _type_ (optional) is one of `string` (default), `number` and `time`, which specifies how to evaluate _expression_ for comparison.

- _descending_ (optional) is a boolean value to determine if comparison should be done in descending (reverse) order, which defaults to `false`.

Sort keys listed earlier take precedence over ones listed later. For example, if you want to sort articles by the date and then by the author, specify `[["{{date}}", "time"], "{{author}}"]`.

Sorting is done stably, so even if all events have the same set of sort key values the original order is retained. Also, a special Liquid variable `_index_` is provided, which contains the zero-based index number of each event, which means you can exactly reverse the order of events by specifying `[["{{_index_}}", "number", true]]`.

DataOutputAgent will select the last `events_to_show` entries of its received events sorted in the order specified by `events_order`, which is defaulted to the event creation time. So, if you have multiple source agents that may create many events in a run, you may want to either increase `events_to_show` to have a larger "window", or specify the `events_order` option to an appropriate value (like `date_published`) so events from various sources are properly mixed in the resulted feed.

There is also an option `events_list_order` that only controls the order of events listed in the final output, without attempting to maintain a total order of received events. It has the same format as `events_order` and is defaulted to `[["{{_index_}}","number",true]]` so the selected events are listed in reverse order like most popular RSS feeds list their articles.

**Liquid Templating**

In [Liquid](https://github.com/huginn/huginn/wiki/Formatting-Events-using-Liquid) templating, the following variable is available:

- `events`: An array of events being output, sorted in the given order, up to `events_to_show` in number. For example, if source events contain a site title in the `site_title` key, you can refer to it in `template.title` by putting `{{events.first.site_title}}`.

---

### De Duplication Agent - 数据去重

`Creates events` `Receives events`

De-duplication Agent 在接受数据后，会自动比对并去除重复数据。

`property` the value that should be used to determine the uniqueness of the event (empty to use the whole payload)

`lookback` amount of past Events to compare the value to (0 for unlimited)

`expected_update_period_in_days` is used to determine if the Agent is working.

---

### Delay Agent - 缓冲存储区

`Creates events` `Receives events`

Delay Agent 存储收到的事件，并按计划发送它们的副本。将其用作事件的缓冲区或队列。

`max_events` should be set to the maximum number of events that you'd like to hold in the buffer. When this number is reached, new events will either be ignored, or will displace the oldest event already in the buffer, depending on whether you set `keep` to `newest` or `oldest`.

`expected_receive_period_in_days` is used to determine if the Agent is working. Set it to the maximum number of days that you anticipate passing without this Agent receiving an incoming Event.

`max_emitted_events` is used to limit the number of the maximum events which should be created. If you omit this DelayAgent will create events for every event stored in the memory.

---

### Digest Agent - 摘要汇总 - 未理解

`Creates events` `Receives events`

Digest Agent 收集发送给它的任何事件并将其作为单个事件发出。

The resulting Event will have a payload message of `message`. You can use liquid templating in the `message`, have a look at the [Wiki](https://github.com/huginn/huginn/wiki/Formatting-Events-using-Liquid) for details.

Set `expected_receive_period_in_days` to the maximum amount of time that you'd expect to pass between Events being received by this Agent.

If `retained_events` is set to 0 (the default), all received events are cleared after a digest is sent. Set `retained_events` to a value larger than 0 to keep a certain number of events around on a rolling basis to re-send in future digests.

For instance, say `retained_events` is set to 3 and the Agent has received Events `5`, `4`, and `3`. When a digest is sent, Events `5`, `4`, and `3` are retained for a future digest. After Event `6` is received, the next digest will contain Events `6`, `5`, and `4`.

---

### Dkt Clustering Agent - 数据挖掘算法？

`Creates events` `Receives events` `Consumes file pointer` `Dry runs `
[huginn_dkt_curation_agents](http://huginnio.herokuapp.com/agent_gems#huginn_dkt_curation_agents) 使用 DKT APIs，其中含有多个 agents，具体查看上方链接。

The `DktClusteringAgent` clusters the input document collection. The document collection first has to be converted to a set of vectors.
DktClusteringAgent 会对输入文档集合进行聚类，文档集合首先必须被转换成一组向量。输入文档需要为特定格式，DktClusteringAgent 会在这个输入数据中查找集群。输入会包含查找到的集群数量和找到的集群特定值的信息。

The Agent expects the input in this particular format and then proceeds to find clusters in this input data. The output contains information on the number of clusters found and specific values for the found clusters.

The Agent accepts all configuration options of the `/e-clustering/generateClusters` endpoint as of september 2016, have a look at the [offical documentation](https://github.com/dkt-projekt/e-Clustering#e-clustering-1) if you need additional information

All Agent configuration options are interpolated using [Liquid](https://github.com/cantino/huginn/wiki/Formatting-Events-using-Liquid) in the context of the received event.

`url` allows to customize the endpoint of the API when hosting the DKT services elswhere.

`body` use [Liquid](https://github.com/cantino/huginn/wiki/Formatting-Events-using-Liquid) templating to specify the input .arff file. See http://www.cs.waikato.ac.nz/ml/weka/arff.html for an explanation of this format.

`language` language of the source data

`algorithm`: the algorithm to be used during clustering. Currently EM and Kmeans are supported.

`merge` set to `true` to retain the received payload and update it with the extracted result

`result_key` when present the emitted Event data will be nested inside the specified key

**When receiving a file pointer:**

`body` will be ignored and the contents of the received file will be send instead.

This agent can consume a ‘file pointer’ event from the following agents with no additional configuration: `FtpsiteAgent`, `LocalFileAgent`, `S3Agent`. Read more about the concept in the [wiki](https://github.com/huginn/huginn/wiki/How-Huginn-works-with-files).

---

### Dropbox File Url

`Agent Creates` `events Receives events` `Dry runs` `Dropbox oauth2`

DropboxFileUrlAgent 用于使用 Dropbox。它需要一个文件路径（或多个文件路径），并通过[临时链接](https://www.dropbox.com/developers/core/docs#media)或[永久链接](https://www.dropbox.com/developers/core/docs#shares)发送事件。

Include the `dropbox-api` and `omniauth-dropbox` gems in your `Gemfile` and set `DROPBOX_OAUTH_KEY` and `DROPBOX_OAUTH_SECRET` in your environment to use Dropbox Agents.

The incoming event payload needs to have a `paths` key, with a comma-separated list of files you want the URL for. For example:

```json
{
  "paths": "first/path, second/path"
}
```

**TIP**: You can use the _Event Formatting Agent_ to format events before they come in. Here’s an example configuration for formatting an event coming out of a _Dropbox Watch Agent_:

```json
{
  "instructions": {
    "paths": "{{ added | map: 'path' | join: ',' }}"
  },
  "matchers": [],
  "mode": "clean"
}
```

An example of usage would be to watch a specific Dropbox directory (with the _DropboxWatchAgent_) and get the URLs for the added or updated files. You could then, for example, send emails with those links.

Set `link_type` to `'temporary'` if you want temporary links, or to `'permanent'` for permanent ones.

---

### Dropbox Watch Agent

`Creates events` `Dropbox oauth2`

Dropbox Watch Agent 监测给定值`dir_to_watch`并发出检测到的更改的事件。

Include the `dropbox-api` and `omniauth-dropbox` gems in your `Gemfile` and set `DROPBOX_OAUTH_KEY` and `DROPBOX_OAUTH_SECRET` in your environment to use Dropbox Agents.

---

### Email Agent - 邮件触发器？

`Receives events`

Email Agent 收到任何内容后，会立即发送邮件通知。

You can specify the email’s subject line by providing a `subject` option, which can contain [Liquid](https://github.com/huginn/huginn/wiki/Formatting-Events-using-Liquid) formatting. E.g., you could provide `"Huginn email"` to set a simple subject, or `{{subject}}` to use the `subject` key from the incoming Event.

By default, the email body will contain an optional `headline`, followed by a listing of the Events’ keys.

You can customize the email body by including the optional `body` param. Like the `subject`, the `body` can be a simple message or a Liquid template. You could send only the Event's `some_text` field with a `body` set to `{{ some_text }}`. The body can contain simple HTML and will be sanitized. Note that when using `body`, it will be wrapped with `<html>` and `<body>` tags, so you do not need to add these yourself.

You can specify one or more `recipients` for the email, or skip the option in order to send the email to your account's default email address.

You can provide a `from` address for the email, or leave it blank to default to the value of `EMAIL_FROM_ADDRESS` (``).

You can provide a `content_type` for the email and specify `text/plain` or `text/html` to be sent. If you do not specify `content_type`, then the recipient email server will determine the correct rendering.

Set `expected_receive_period_in_days` to the maximum amount of time that you'd expect to pass between Events being received by this Agent.

---

### Email Digest Agent - 邮件摘要

`Receives events`

Email Digest Agent 收集发送给它的任何事件，并按计划通过电子邮件发送。使用事件的数目与 `Keep events` 有关，这意味着如果事件在 Email Digest Agent 计划运行之前到期，它们将不会出现在电子邮件中。

By default, the will have a `subject` and an optional `headline` before listing the Events. If the Events' payloads contain a `message`, that will be highlighted, otherwise everything in their payloads will be shown.

You can specify one or more `recipients` for the email, or skip the option in order to send the email to your account's default email address.

You can provide a `from` address for the email, or leave it blank to default to the value of `EMAIL_FROM_ADDRESS` (``).

You can provide a `content_type` for the email and specify `text/plain` or `text/html` to be sent. If you do not specify `content_type`, then the recipient email server will determine the correct rendering.

Set `expected_receive_period_in_days` to the maximum amount of time that you'd expect to pass between Events being received by this Agent.

---

### Evernote Agent

`Creates events` `Receives events` `Evernote`

Evernote Agent 与你的 Evernote 账户相连，新建笔记。

Visit [Evernote](https://dev.evernote.com/doc/) to set up an Evernote app and receive an api key and secret. Store these in the Evernote environment variables in the .env file. You will also need to create a [Sandbox](https://sandbox.evernote.com/Registration.action) account to use during development.

Next, you'll need to authenticate with Evernote in the [Services](http://huginnio.herokuapp.com/services) section.

Options:

- `mode` - Two possible values:

  - `update` Based on events it receives, the agent will create notes or update notes with the same `title` and `notebook`

  - `read` On a schedule, it will generate events containing data for newly added or updated notes

- `include_xhtml_content` - Set to `true` to include the content in ENML (Evernote Markup Language) of the note

- `note`

  - When `mode` is `update` the parameters of `note` are the attributes of the note to be added/edited. To edit a note, both `title` and `notebook` must be set.

    For example, to add the tags 'comic' and 'CS' to a note titled 'xkcd Survey' in the notebook 'xkcd', use:

    ```json
    "notes": {
      "title": "xkcd Survey",
      "content": "",
      "notebook": "xkcd",
      "tagNames": "comic, CS"
    }
    ```

    If a note with the above title and notebook did note exist already, one would be created.

  - When `mode` is `read` the values are search parameters. Note: The `content` parameter is not used for searching. Setting `title` only filters notes whose titles contain `title` as a substring, not as the exact title.

    For example, to find all notes with tag 'CS' in the notebook 'xkcd', use:

    ```json
    "notes": {
      "title": "",
      "content": "",
      "notebook": "xkcd",
      "tagNames": "CS"
    }
    ```

---

### Freme Explore Agent - SPARQL-数据断点？

`Creates events` `Receives events` `Dry runs` [huginn_freme_enrichment_agents](http://huginnio.herokuapp.com/agent_gems#huginn_freme_enrichment_agents) 使用 FREME APIs，其中含有多个 agents，具体查看上方链接。

The `FremeExploreAgent` can retrieve description of a resource from a given endpoint. The endpoint can be SPARQL or Linked Data Fragments endpoint.
FremeExploreAgent 可以检索给定端点的资源描述。端点可以是 SPARQL 或 Linked Data Fragments 端点。

The Agent accepts all configuration options of the `/e-link/explore` endpoint as of September 2016, have a look at the [offical documentation](http://api.freme-project.eu/doc/current/api-doc/full.html#!/e-Link/explore) if you need additional information.

All Agent configuration options are interpolated using [Liquid](https://github.com/cantino/huginn/wiki/Formatting-Events-using-Liquid) in the context of the received event.

`base_url` allows to customize the API server when hosting the FREME services elswhere.

`auth_token` can be set to access private filters, datasets, templates or pipelines (depending on the agent).

`outformat` requested RDF serialization format of the output (required), CSV is only supported when using a filter.

`resource` a URI of the resource which should be described (required).

`endpoint` a URL of the endpoint which should be used to retrieve info about the resource.

`endpoint_type` the type of the endpoint (required).

`filter` allows to post-process the results using a pre-configured SPARQL filter. Check the [official documentation](http://api.freme-project.eu/doc/current/knowledge-base/freme-for-api-users/filtering.html) for details.

`merge` set to `true` to retain the received payload and update it with the extracted result

`result_key` when present the emitted Event data will be nested inside the specified key

---

### Ftpsite Agent

`Creates events` `Receives events` `Emits file pointer`

Ftp Site Agent 检查 FTP 站点，并根据目录中新上载的文件创建事件。当接收到事件时，它会在配置的 FTP 服务器上创建文件。

`mode` must be present and either `read` or `write`, in `read` mode the agent checks the FTP site for changed files, with `write` it writes received events to a file on the server.

**Universal options**

Specify a `url` that represents a directory of an FTP site to watch, and a list of `patterns` to match against file names.

Login credentials can be included in `url` if authentication is required: `ftp://username:password@ftp.example.com/path`. Liquid formatting is supported as well: `ftp://{% credential ftp_credentials %}@ftp.example.com/`

Optionally specify the encoding of the files you want to read/write in `force_encoding`, by default UTF-8 is used.

**Reading**

Only files with a last modification time later than the `after` value, if specifed, are emitted as event.

**Writing**

Specify the filename to use in `filename`, Liquid interpolation is possible to change the name per event.

Use [Liquid](https://github.com/huginn/huginn/wiki/Formatting-Events-using-Liquid) templating in `data` to specify which part of the received event should be written.

This agent only emits a ‘file pointer’, not the data inside the files, the following agents can consume the created events: `CsvAgent`, `PostAgent`, `ReadFileAgent`. Read more about the concept in the [wiki](https://github.com/huginn/huginn/wiki/How-Huginn-works-with-files).
