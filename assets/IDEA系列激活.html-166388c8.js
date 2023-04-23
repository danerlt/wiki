import{_ as t,Y as o,Z as c,$ as e,a0 as n,a1 as a,a2 as d,D as r}from"./framework-d3f694d0.js";const s={},l=d('<h1 id="idea系列激活" tabindex="-1"><a class="header-anchor" href="#idea系列激活" aria-hidden="true">#</a> IDEA系列激活</h1><p>以 WebStorm 2022.2.3 为例</p><h2 id="安装-webstorm" tabindex="-1"><a class="header-anchor" href="#安装-webstorm" aria-hidden="true">#</a> 安装 WebStorm</h2><p>点击 <code>WebStorm-2022.2.3.exe</code>,然后点击<code>next</code><img src="https://danerlt-1258802437.cos.ap-chongqing.myqcloud.com/2023-04-19-E70ong.png" alt="" loading="lazy"> 设置如下: <img src="https://danerlt-1258802437.cos.ap-chongqing.myqcloud.com/2023-04-19-Fl7nPr.png" alt="" loading="lazy"> 等待安装完成,点击<code>finish</code><img src="https://danerlt-1258802437.cos.ap-chongqing.myqcloud.com/2023-04-19-cizHsc.png" alt="" loading="lazy"></p><h2 id="下载激活包" tabindex="-1"><a class="header-anchor" href="#下载激活包" aria-hidden="true">#</a> 下载激活包</h2>',5),m={href:"https://www.jiweichengzhu.com/ide/code",target:"_blank",rel:"noopener noreferrer"},p=d(`<p>关注这个博主: 【雨落无影】的微信公众号,回复关键字【下载】获取下载码</p><p>文件类型选择<code>ja-netfilter.v3</code>,然后输入下载码,点击下载</p><figure><img src="https://danerlt-1258802437.cos.ap-chongqing.myqcloud.com/2023-04-19-9a6KCF.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>然后将压缩包解压, 我这里用的目录是:<code>D:/Program Files/ja-netfilter.v3</code>, 后面的配置文件中路径要和这个路径保持一致.</p><figure><img src="https://danerlt-1258802437.cos.ap-chongqing.myqcloud.com/2023-04-19-Te6lhu.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="修改vmoptions文件" tabindex="-1"><a class="header-anchor" href="#修改vmoptions文件" aria-hidden="true">#</a> 修改vmoptions文件</h2><p>vmoptions文件路径为:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>C:\\Program Files\\JetBrains\\WebStorm 2022.2.3\\bin\\webstorm64.exe.vmoptions
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>修改后的内容如下:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>-Xms128m
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
-Djdk.http.auth.tunneling.disabledSchemes=&quot;&quot;
-Djdk.attach.allowAttachSelf=true
-Djdk.module.illegalAccess.silent=true
-Dkotlinx.coroutines.debug=off


--add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED
--add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED


-javaagent:D:/Program Files/ja-netfilter.v3/ja-netfilter.jar
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>修改配置之后要重启IDE,这一步一定要执行</strong></p><h2 id="填入激活码" tabindex="-1"><a class="header-anchor" href="#填入激活码" aria-hidden="true">#</a> 填入激活码</h2>`,12),u={href:"https://www.jiweichengzhu.com/ide/code",target:"_blank",rel:"noopener noreferrer"},g=d('<p>选择文件类型下拉框选择<code>激活码</code>,然后选择 IDE 为 WebStorm, 然后输入公众号获取的下载码.</p><figure><img src="https://danerlt-1258802437.cos.ap-chongqing.myqcloud.com/2023-04-19-HOVuA6.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>然后点击<code>Help</code>-&gt;<code>Register</code>, 再点击<code>Activate New License</code><img src="https://danerlt-1258802437.cos.ap-chongqing.myqcloud.com/2023-04-19-RYDbWV.png" alt="" loading="lazy"></p><p>选择<code>Activation Code</code>填入上面下载的激活码, <code>Code With Me</code>插件也需要填入激活码</p><figure><img src="https://danerlt-1258802437.cos.ap-chongqing.myqcloud.com/2023-04-19-XSBqnl.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>',5),h={href:"https://www.jiweichengzhu.com/article/edb833a8005144beb3486d6af18826fa",target:"_blank",rel:"noopener noreferrer"};function v(b,f){const i=r("ExternalLinkIcon");return o(),c("div",null,[l,e("p",null,[n("打开: "),e("a",m,[n("https://www.jiweichengzhu.com/ide/code"),a(i)])]),p,e("p",null,[n("还是打开: "),e("a",u,[n("https://www.jiweichengzhu.com/ide/code"),a(i)])]),g,e("p",null,[n("参考链接: "),e("a",h,[n("IntelliJ IDEA 2022.2 版本最新2099年永久激活方法，亲测可用，也可以开启新UI了。"),a(i)])])])}const x=t(s,[["render",v],["__file","IDEA系列激活.html.vue"]]);export{x as default};
