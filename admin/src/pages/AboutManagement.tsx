import { useEffect, useState } from 'react';
import { authApiRequest } from '../services/api';

export default function AboutManagement() {
  const [settings, setSettings] = useState({
    aboutTitle: '',
    aboutContent: '',
    aboutButton1Text: '',
    aboutButton1Link: '',
    aboutButton2Text: '',
    aboutButton2Link: '',
    aboutButton3Text: '',
    aboutButton3Link: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await authApiRequest('settings');
      setSettings({
        aboutTitle: data.aboutTitle || '联系我们',
        aboutContent: data.aboutContent || '',
        aboutButton1Text: data.aboutButton1Text || '免费咨询',
        aboutButton1Link: data.aboutButton1Link || '',
        aboutButton2Text: data.aboutButton2Text || '工具下载',
        aboutButton2Link: data.aboutButton2Link || '',
        aboutButton3Text: data.aboutButton3Text || '加入社群',
        aboutButton3Link: data.aboutButton3Link || '',
      });
    } catch (error) {
      console.error('加载设置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authApiRequest('admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ settings }),
      });
      alert('保存成功！');
    } catch (error: any) {
      alert('保存失败: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">关于我们</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">页面设置</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                页面标题
              </label>
              <input
                type="text"
                value={settings.aboutTitle}
                onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                页面内容（支持多段落，用换行分隔）
              </label>
              <textarea
                value={settings.aboutContent}
                onChange={(e) => setSettings({ ...settings, aboutContent: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="每行一段内容..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  按钮1文字
                </label>
                <input
                  type="text"
                  value={settings.aboutButton1Text}
                  onChange={(e) => setSettings({ ...settings, aboutButton1Text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  按钮1链接
                </label>
                <input
                  type="text"
                  value={settings.aboutButton1Link}
                  onChange={(e) => setSettings({ ...settings, aboutButton1Link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  按钮2文字
                </label>
                <input
                  type="text"
                  value={settings.aboutButton2Text}
                  onChange={(e) => setSettings({ ...settings, aboutButton2Text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  按钮2链接
                </label>
                <input
                  type="text"
                  value={settings.aboutButton2Link}
                  onChange={(e) => setSettings({ ...settings, aboutButton2Link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  按钮3文字
                </label>
                <input
                  type="text"
                  value={settings.aboutButton3Text}
                  onChange={(e) => setSettings({ ...settings, aboutButton3Text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  按钮3链接
                </label>
                <input
                  type="text"
                  value={settings.aboutButton3Link}
                  onChange={(e) => setSettings({ ...settings, aboutButton3Link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存设置'}
          </button>
        </div>
      </form>
    </div>
  );
}
