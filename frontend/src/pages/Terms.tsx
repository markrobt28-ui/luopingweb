import { motion } from 'framer-motion';

const Terms = () => {
  return (
    <div className="pt-20 md:pt-24 px-4 md:px-6 lg:px-8 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 gradient-text">
            服务条款
          </h1>
          <p className="text-gray-400 text-lg">
            最后更新时间：2024年12月24日
          </p>
        </div>

        {/* 内容 */}
        <div className="glass-card p-8 md:p-12 rounded-2xl space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. 服务说明</h2>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                欢迎使用我们的在线工具平台。通过访问或使用本网站，您同意遵守以下服务条款。
              </p>
              <p>
                我们提供各种在线工具和服务，包括但不限于：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>开发工具（JSON格式化、Base64编解码等）</li>
                <li>设计工具（颜色选择器、图片压缩等）</li>
                <li>实用工具（二维码生成、密码生成等）</li>
                <li>博客和技术分享</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. 用户责任</h2>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>使用我们的服务时，您同意：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>提供真实、准确的注册信息</li>
                <li>保护账户安全，不与他人共享密码</li>
                <li>不进行任何非法或未经授权的活动</li>
                <li>不上传恶意代码或有害内容</li>
                <li>不滥用服务或干扰其他用户</li>
                <li>遵守所有适用的法律法规</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. 知识产权</h2>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                本网站的所有内容，包括但不限于文本、图形、代码、设计，均受知识产权法保护。
              </p>
              <p>未经许可，您不得：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>复制、修改或分发网站内容</li>
                <li>反向工程或反编译我们的软件</li>
                <li>移除版权或所有权声明</li>
                <li>用于商业目的</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. 免责声明</h2>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                我们的服务按"现状"提供，不提供任何明示或暗示的保证：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>不保证服务不会中断或无错误</li>
                <li>不保证结果的准确性或可靠性</li>
                <li>不对使用服务造成的任何损失负责</li>
                <li>不对第三方链接的内容负责</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. 责任限制</h2>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                在法律允许的最大范围内，我们不对以下情况承担责任：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>直接、间接、偶然或后果性损害</li>
                <li>利润损失或数据丢失</li>
                <li>业务中断</li>
                <li>第三方行为</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. 账户终止</h2>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                我们保留在以下情况下暂停或终止您账户的权利：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>违反服务条款</li>
                <li>从事非法活动</li>
                <li>滥用服务</li>
                <li>长期不活跃</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. 服务变更</h2>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                我们保留随时修改、暂停或终止服务的权利，恕不另行通知。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. 争议解决</h2>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                因使用本服务产生的任何争议，应首先通过友好协商解决。
                如协商不成，应提交至我们所在地有管辖权的法院解决。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. 条款修改</h2>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                我们可能会不时更新这些条款。继续使用服务即表示您接受修改后的条款。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. 联系方式</h2>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>如有任何问题，请联系我们：</p>
              <ul className="list-none space-y-2 ml-4">
                <li>📧 邮箱：188016226@qq.com</li>
                <li>💬 微信：LP20241688</li>
              </ul>
            </div>
          </section>

          <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <p className="text-blue-300 text-sm leading-relaxed">
              💡 提示：使用本网站即表示您已阅读、理解并同意遵守上述服务条款。
              如果您不同意这些条款，请停止使用我们的服务。
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Terms;
