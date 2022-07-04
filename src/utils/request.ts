import axios from 'axios';
import { Biaoqing233Item, DoutuItem } from '../models';

enum TypeEnum {
  LATEST = 'latest',
  HOT = 'hot',
}

interface FetchParams {
  type?: TypeEnum;
  page?: number | string;
  limit?: number | string;
}
interface SearchParams {
  keyword: string;
  limit?: number | string;
}

const getBiaoqing233Url = (key: string) => `https://wx3.sinaimg.cn/large/${key}`;

function toLocalDoutuItem(item: Biaoqing233Item) {
  return {
    id: item._id,
    title: item.title,
    url: getBiaoqing233Url(item.key),
    fileName: item.key,
  };
}

export async function fetchGIFs({
  type = TypeEnum.LATEST,
  page = 1,
  limit = 30,
}: FetchParams = {}): Promise<DoutuItem[]> {
  const res = await axios({
    method: 'GET',
    url: 'https://biaoqing233.com/app/pictures',
    params: { type, page, limit },
  });
  const items: Biaoqing233Item[] = res.data?.docs;
  return items.map(toLocalDoutuItem);
}

export async function searchGIFs({ keyword, limit = 30 }: SearchParams): Promise<DoutuItem[]> {
  const res = await axios({
    method: 'GET',
    url: `https://biaoqing233.com/app/search/${encodeURI(keyword)}`,
    params: { limit },
  });
  const items: Biaoqing233Item[] = res.data?.docs;
  return items.map(toLocalDoutuItem);
}
