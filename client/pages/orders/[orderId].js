import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import Link from 'next/link';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return (
      <div>
        <div className="row" style={{ height: '40vh' }}>
          <div className="card col-10 col-lg-6  g-3 m-auto">
            <div className="card-header ">Order Expired! </div>
            <div className="card-body">
              <Link href="/">
                <a className="btn btn-success">Go back to list...</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row" style={{ height: '40vh' }}>
      <div className="card col-10 col-lg-6  g-3 m-auto">
        <div className="card-header ">
          You have {timeLeft} seconds left to make payment before order
          expiration
        </div>
        <div className="card-body">
          <h5 className="card-title">{order.voucher.product}</h5>
          <p className="card-text">You're paying ${order.voucher.price}</p>
          <div className="w-25">
            <StripeCheckout
              token={({ id }) => doRequest({ token: id })}
              stripeKey="pk_test_51Lvju3CffI2kT3qdfPH7RxWa4kjPCUD62iHqjG1fZKeeNwmnYqZWNsp5EvWciZbhzj8KIesoRGSHDS0xDSWilP6r00ugrWZj6g"
              amount={order.voucher.price * 100}
              email={currentUser.email}
            />
          </div>
        </div>
        {errors}
      </div>
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
