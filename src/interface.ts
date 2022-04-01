
// 专栏数据类型接口
export interface ColumnProps {
  id: number; // id
  title: string; // 标题
  avatar?: string; // 图片
  description: string; // 简介
}


// 用户信息接口类型
export interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
}