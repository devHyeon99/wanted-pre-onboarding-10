import { forwardRef } from 'react';
import styles from './ItemCard.module.css';

interface MockData {
  productId: string;
  productName: string;
  price: number;
  boughtDate: string;
}

const ItemCard = forwardRef<HTMLDivElement, MockData>((props, ref) => {
  const { productName, price, boughtDate } = props;

  return (
    <article className={styles.wrapper} ref={ref}>
      <h2>{productName}</h2>
      <p>{price}</p>
      <p>{boughtDate}</p>
    </article>
  );
});

export default ItemCard;
