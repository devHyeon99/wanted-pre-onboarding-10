import ItemCard from './ItemCard';
import styles from './ItemList.module.css';
import { getMockData } from '../hooks/useGetMockData';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface MockData {
  productId: string;
  productName: string;
  price: number;
  boughtDate: string;
}

interface GetMockDataResult {
  datas: MockData[];
  isEnd: boolean;
}

const ItemList = () => {
  const [data, setData] = useState<MockData[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const isMount = useRef(true);

  const fetchData = useCallback((page = 1) => {
    setLoading(true);
    getMockData(page)
      .then((result) => {
        const dataResult = result as GetMockDataResult;
        setData((prevData) => [...prevData, ...dataResult.datas]);
        setIsEnd(dataResult.isEnd);
      })
      .catch((error) => {
        console.error('데이터 로딩 중 오류 발생:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isMount.current) {
      fetchData();
      isMount.current = false;
    }
  }, [fetchData]);

  useEffect(() => {
    if (page > 1) {
      fetchData(page);
    }
  }, [page, fetchData]);

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && !isEnd) {
        setPage((prev) => prev + 1);
      }
    };

    observer.current = new IntersectionObserver(callback);
    if (lastItemRef.current) {
      observer.current.observe(lastItemRef.current);
    }
  }, [loading, fetchData, isEnd]);

  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + item.price, 0);
  }, [data]);

  const renderContent = (
    <>
      <p className={styles.total}>현재 가져온 아이템 총 합: {total}</p>
      {data.map((item, index) => (
        <ItemCard
          {...item}
          key={item.productId}
          ref={index === data.length - 1 ? lastItemRef : null}
        />
      ))}
      {loading && <p>로딩중...</p>}
      {isEnd && <p>모든 데이터를 불러왔습니다.</p>}
    </>
  );

  return <section className={styles.wrapper}>{renderContent}</section>;
};

export default ItemList;
