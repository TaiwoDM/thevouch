import useRequest from './../../hooks/use-request';
import Router from 'next/router';

const HomeShow = ({ home }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      homeId: home.id,
    },
    onSuccess: (order) => {
      Router.push('/orders/[orderId]', `/orders/${order.id}`);
    },
  });

  return (
    <div>
      <h1>{home.title}</h1>
      <h4>Price: {home.price}</h4>
      <h4>Percentage Off: {home.percentageOff}%</h4>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};
HomeShow.getInitialProps = async (context, client) => {
  const { homeId } = context.query;
  const { data } = await client.get(`/api/homes/${homeId}`);

  return { home: data };
};

export default HomeShow;
