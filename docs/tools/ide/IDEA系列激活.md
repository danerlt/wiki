# IDEA系列激活

以 WebStorm 2022.2.3 为例

## 安装 WebStorm

点击 `WebStorm-2022.2.3.exe`,然后点击`next`
![](https://danerlt-1258802437.cos.ap-chongqing.myqcloud.com/2023-04-19-E70ong.png)
设置如下:
![](https://danerlt-1258802437.cos.ap-chongqing.myqcloud.com/2023-04-19-Fl7nPr.png)
等待安装完成,点击`finish`
![](https://danerlt-1258802437.cos.ap-chongqing.myqcloud.com/2023-04-19-cizHsc.png)

## 下载激活包

打开: [https://www.jiweichengzhu.com/ide/code](https://www.jiweichengzhu.com/ide/code)

关注这个博主: 【雨落无影】的微信公众号,回复关键字【下载】获取下载码

文件类型选择`ja-netfilter.v3`,然后输入下载码,点击下载

![](https://danerlt-1258802437.cos.ap-chongqing.myqcloud.com/2023-04-19-9a6KCF.png)

然后将压缩包解压, 我这里用的目录是:`D:/Program Files/ja-netfilter.v3`, 后面的配置文件中路径要和这个路径保持一致.

![](https://danerlt-1258802437.cos.ap-chongqing.myqcloud.com/2023-04-19-Te6lhu.png)

## 修改vmoptions文件

vmoptions文件路径为:

```
C:\Program Files\JetBrains\WebStorm 2022.2.3\bin\webstorm64.exe.vmoptions
```

修改后的内容如下:

```
-Xms128m
-Xmx2048m
-XX:ReservedCodeCacheSize=512m
-XX:+UseG1GC
-XX:SoftRefLRUPolicyMSPerMB=50
-XX:CICompilerCount=2
-XX:+HeapDumpOnOutOfMemoryError
-XX:-OmitStackTraceInFastThrow
-XX:+IgnoreUnrecognizedVMOptions
-XX:CompileCommand=exclude,com/intellij/openapi/vfs/impl/FilePartNodeRoot,trieDescend
-ea
-Dsun.io.useCanonCaches=false
-Dsun.java2d.metal=true
-Djbr.catch.SIGABRT=true
-Djdk.http.auth.tunneling.disabledSchemes=""
-Djdk.attach.allowAttachSelf=true
-Djdk.module.illegalAccess.silent=true
-Dkotlinx.coroutines.debug=off


--add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED
--add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED


-javaagent:D:/Program Files/ja-netfilter.v3/ja-netfilter.jar
```

**修改配置之后要重启IDE,这一步一定要执行**

## 填入激活码

还是打开: [https://www.jiweichengzhu.com/ide/code](https://www.jiweichengzhu.com/ide/code)

选择文件类型下拉框选择`激活码`,然后选择 IDE 为 WebStorm, 然后输入公众号获取的下载码.

![](https://danerlt-1258802437.cos.ap-chongqing.myqcloud.com/2023-04-19-HOVuA6.png)

然后点击`Help`->`Register`, 再点击`Activate New License`
![](https://danerlt-1258802437.cos.ap-chongqing.myqcloud.com/2023-04-19-RYDbWV.png)

选择`Activation Code`填入上面下载的激活码, `Code With Me`插件也需要填入激活码

![](https://danerlt-1258802437.cos.ap-chongqing.myqcloud.com/2023-04-19-XSBqnl.png)

参考链接: [IntelliJ IDEA 2022.2 版本最新2099年永久激活方法，亲测可用，也可以开启新UI了。](https://www.jiweichengzhu.com/article/edb833a8005144beb3486d6af18826fa)
