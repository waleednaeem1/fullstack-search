import { Card, Tag, Progress, Typography } from "antd";
import { FileTextOutlined, StarFilled } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

type Props = {
  title: string;
  body: string;
  index: number;
  relevance?: number;
};

export default function ResultCard({ title, body, index, relevance = 90 }: Props) {
  const getRelevanceColor = (score: number) => {
    if (score >= 90) return '#52c41a';
    if (score >= 80) return '#1890ff';
    if (score >= 70) return '#faad14';
    return '#ff4d4f';
  };

  return (
    <Card 
      className="result-card h-full border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      bodyStyle={{ padding: '20px' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
            {index}
          </div>
          <FileTextOutlined className="text-blue-500 text-lg" />
        </div>
        
        <div className="flex items-center gap-2">
          <StarFilled className="text-yellow-500 text-sm" />
          <Text strong style={{ color: getRelevanceColor(relevance), fontSize: '14px' }}>
            {relevance}% match
          </Text>
        </div>
      </div>

      <div className="mb-4">
        <Text strong className="text-lg text-gray-900 line-clamp-2 leading-tight">
          {title}
        </Text>
      </div>

      <Paragraph 
        className="text-gray-600 mb-4 leading-relaxed"
        ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}
      >
        {body}
      </Paragraph>

      <div className="flex items-center justify-between">
        <Tag color="blue" className="text-xs">
          {Math.ceil(body.length / 200)} min read
        </Tag>
        
        <div className="flex-1 max-w-24">
          <Progress 
            percent={relevance} 
            size="small" 
            strokeColor={getRelevanceColor(relevance)}
            showInfo={false}
          />
        </div>
      </div>
    </Card>
  );
}