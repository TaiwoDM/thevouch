import Link from 'next/link';

const OrderIndex = ({ orders }) => {
  const checkStat = (stat) => {
    if (stat == 'complete') {
      return <span class="badge text-bg-success rounded-pill">{stat}</span>;
    } else if (stat == 'cancelled') {
      return <span class="badge text-bg-danger rounded-pill">{stat}</span>;
    } else {
      return <span class="badge text-bg-warning rounded-pill">{stat}</span>;
    }
  };
  return (
    <div className="row" style={{ height: '40vh' }}>
      <div className="col-10 col-lg-6  g-3 m-auto">
        <ul class="list-group">
          {orders.map((order) => {
            return (
              <li class="list-group-item d-flex justify-content-between align-items-start">
                <div class="ms-2 me-auto">
                  <div class="fw-bold">{order.voucher.product}</div>
                  Price - {order.voucher.price}
                </div>
                <Link href={'/orders/' + order.id}>
                  <a
                    href="/"
                    className="d-flex align-items-center mb-2 mb-lg-0 text-black text-decoration-none"
                  >
                    {checkStat(order.status)}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');

  return { orders: data };
};

export default OrderIndex;
