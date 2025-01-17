import React from 'react';
import { Table, Input, Form, Select, Checkbox, Typography, Divider, Avatar, Layout } from 'antd';
import ChangeLog from './components/ChangeLog';
import styles from './index.css';

// import './test.js';

export default function () {
  const [dataSource, setDataSource] = React.useState([]);

  const columns = [
    {
      align: 'center',
      title: '',
      dataIndex: 'hash',
      width: 50,
      render: (value: string, { hash }: any) => (
        <Form.Item name={[hash, 'use']} valuePropName="checked" noStyle>
          <Checkbox />
        </Form.Item>
      ),
    },
    {
      title: 'PR / Commit',
      dataIndex: 'hash',
      width: 80,
      render(value: string, { hash }: any) {
        return (
          <>
            <Form.Item name={[hash, 'pr']} noStyle>
              <Input placeholder="NO PR" />
            </Form.Item>
            <a
              href={`${
                (window as any).gitRemoteUrl || 'https://github.com/ant-design/ant-design'
              }/commit/${value}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {value.slice(0, 7)}
            </a>
          </>
        );
      },
    },
    {
      title: 'Category',
      dataIndex: 'emoji',
      width: 140,
      render(value = '', { hash }: any) {
        return (
          <>
            <Form.Item name={[hash, 'type']} noStyle>
              <Select
                placeholder="请选择 emoji"
                style={{ width: '100%' }}
                virtual={false}
                listHeight={500}
              >
                <Select.Option value="bug">🐞 Bug</Select.Option>
                <Select.Option value="style">💄 样式</Select.Option>
                <Select.Option value="feature">🆕 新特性</Select.Option>
                <Select.Option value="hotFeature">🔥 厉害的新特性</Select.Option>
                <Select.Option value="ts">🤖 TypeScript</Select.Option>
                <Select.Option value="rtl">⬅️ RTL</Select.Option>
                <Select.Option value="notice">🛎 更新警告/提示信息</Select.Option>
                <Select.Option value="perf">⚡️ 性能提升</Select.Option>
                <Select.Option value="accessibility">⌨️ 可访问性</Select.Option>
                <Select.Option value="locale">🌐 国际化</Select.Option>
                <Select.Option value="refactor">🛠 重构或工具链优化</Select.Option>
                <Select.Option value="deprecated">🗑 废弃或移除</Select.Option>
                <Select.Option value="test">✅ 测试用例</Select.Option>
                <Select.Option value="doc">📖 文档或网站</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name={[hash, 'component']} noStyle>
              <Input style={{ marginTop: 6 }} placeholder="component name" />
            </Form.Item>
          </>
        );
      },
    },
    {
      title: '🇨🇳 中文日志',
      dataIndex: 'chinese',
      render(value = '', { hash }: any) {
        return (
          <Form.Item name={[hash, 'chinese']} noStyle>
            <Input.TextArea rows={2} placeholder="请填写更新日志" />
          </Form.Item>
        );
      },
    },
    {
      title: '🇺🇸 English Changelog',
      dataIndex: 'english',
      render(value = '', { hash }: any) {
        return (
          <Form.Item name={[hash, 'english']} noStyle>
            <Input.TextArea rows={2} placeholder="please add changelog" />
          </Form.Item>
        );
      },
    },
    {
      title: '👩🏻‍💻 Author',
      dataIndex: 'author',
      width: 100,
      render(value = '', { hash }: any) {
        return (
          <Form.Item name={[hash, 'author']} noStyle>
            <Input.TextArea rows={2} />
          </Form.Item>
        );
      },
    },
  ];

  const [form] = Form.useForm();

  React.useEffect(() => {
    const changelog = (window as any).changelog || [];
    setDataSource(changelog);

    const formValues: Record<string, any> = {};
    changelog.forEach(
      ({
        hash,
        chinese = '',
        english = '',
        author = '',
        pr = '',
        component = '',
        title = '',
      }: any) => {
        chinese = chinese.trim() ? `${chinese.trim()}。` : '';
        english = english.trim() ? `${english.trim()}.` : '';

        chinese = chinese.replace('。。', '。');
        english = english.replace('..', '.');
        const type = undefined as string | undefined;

        const values = { chinese, english, author, type, use: true, pr, component };

        if (title.includes('rtl') || english.includes('rtl')) {
          values.type = 'rtl';
        } else if (
          english.includes('style') ||
          chinese.includes('样式') ||
          title.includes('sttyle') ||
          title.includes('💄')
        ) {
          values.type = 'style';
        } else if (
          english.includes('fix') ||
          english.includes('bug') ||
          title.includes('fix') ||
          title.includes('🐞') ||
          title.includes('🐛') ||
          title.includes('bug') ||
          chinese.includes('修复') ||
          chinese.includes('修正')
        ) {
          values.type = 'bug';
        } else if (english.includes('docs:') || title.includes('docs:')) {
          values.type = 'doc';
          values.use = false;
        }

        formValues[hash] = values;
      },
    );
    form.setFieldsValue(formValues);
  }, [form]);

  return (
    <div className={styles.container}>
      <Typography.Title level={1}>
        <Avatar
          src="https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png"
          size="large"
          style={{ marginRight: 12, position: 'relative', top: -4 }}
        />
        CHANGELOG Generator
      </Typography.Title>
      <Form form={form}>
        <Layout style={{ background: '#fff' }}>
          <Layout.Sider width="60%" style={{ background: '#fff' }}>
            <Table
              tableLayout="fixed"
              columns={columns as any}
              rowKey="hash"
              dataSource={dataSource}
              pagination={false}
              size="small"
              scroll={{ y: 'calc(100vh - 160px)' }}
            />
          </Layout.Sider>
          <Layout.Content>
            <Form.Item
              shouldUpdate
              style={{ padding: '0 24px', height: 'calc(100vh - 120px)', overflow: 'auto' }}
            >
              {(form) => {
                const formValues = form.getFieldsValue(true);
                const hashList = dataSource.map((item: { hash: string }) => item.hash);
                return (
                  <>
                    <Divider>🇨🇳 中文日志 🇨🇳</Divider>
                    <ChangeLog hashList={hashList} formValues={formValues} lang="chinese" />
                    <Divider>🇺🇸 English Changelog 🇺🇸</Divider>
                    <ChangeLog hashList={hashList} formValues={formValues} lang="english" />
                  </>
                );
              }}
            </Form.Item>
          </Layout.Content>
        </Layout>
      </Form>
    </div>
  );
}
