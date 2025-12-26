import { motion } from 'framer-motion';

const Privacy = () => {
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
            隐私政策
          </h1>
          <p className="text-gray-400 text-lg">
            最后更新时间：2024年12月24日
          </p>
        </div>

        {/* 内容 */}
        <div className="glass-card p-8 md:p-12 rounded-2xl space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. 信息收集</h2>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                我们重视您的隐私。在使用我们的服务时，我们可能会收集以下信息：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>账户信息：用户名、邮箱地址</li>
                <li>使用数据：访问时间、使用的工具、浏览记录</li>
                <li>设备信息：浏览器类型、操作系统、IP地址</li>
                <li>Cookie和类似技术收集的信息</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. 信息使用</h2>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>我们收集的信息将用于：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>提供、维护和改进我们的服务</li>
                <li>个性化用户体验</li>
                <li>发送服务通知和更新</li>
                <li>分析使用趋势和优化性能</li>
                <li>防止欺诈和滥用行为</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. 信息共享</h2>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                我们不会出售、交易或转让您的个人信息给第三方。以下情况除外：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>获得您的明确同意</li>
                <li>法律法规要求</li>
                <li>保护我们的权利和财产</li>
                <li>与可信的服务提供商合作（他们同意保密）</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. 数据安全</h2>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                我们采取合理的安全措施保护您的信息：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>使用加密技术传输敏感数据</li>
                <li>定期备份数据</li>
                <li>限制员工访问个人信息</li>
                <li>定期审查安全措施</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Cookie使用</h2>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                我们使用Cookie来改善用户体验。您可以通过浏览器设置管理Cookie偏好。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. 您的权利</h2>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>您有权：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>访问和更新您的个人信息</li>
                <li>删除您的账户和数据</li>
                <li>反对或限制某些数据处理</li>
                <li>导出您的数据</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. 儿童隐私</h2>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                我们的服务不面向13岁以下儿童。如果我们发现收集了儿童的个人信息，将立即删除。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. 政策更新</h2>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                我们可能会不时更新本隐私政策。重大变更将通过网站通知或邮件告知您。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. 联系我们</h2>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>如有任何问题或疑虑，请通过以下方式联系我们：</p>
              <ul className="list-none space-y-2 ml-4">
                <li>📧 邮箱：188016226@qq.com</li>
                <li>💬 微信：LP20241688</li>
              </ul>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default Privacy;
