import { Card, Tag, Typography, Space } from "antd";
import { BulbOutlined, LinkOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

type Props = {
  summary: string;
  sources?: string[];
};

export default function SummaryCard({ summary, sources = [] }: Props) {
  return (
    <Card 
      className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500"
      bodyStyle={{ padding: '24px' }}
    >
      <Space direction="vertical" size="middle" className="w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <BulbOutlined className="text-white text-lg" />
          </div>
          <Text strong className="text-xl text-gray-900">AI Summary</Text>
        </div>

        <Paragraph className="text-gray-700 text-lg leading-relaxed !mb-0">
          {summary}
        </Paragraph>

        {sources.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <LinkOutlined className="text-gray-400" />
            <Text type="secondary" className="text-sm">Sources:</Text>
            {sources.map((source, index) => (
              <Tag key={index} color="blue" className="text-xs">
                {source}
              </Tag>
            ))}
          </div>
        )}
      </Space>
    </Card>
  );
}