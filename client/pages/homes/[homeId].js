import useRequest from './../../hooks/use-request';
import Router from 'next/router';
import Link from 'next/link';

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
    <div className="container">
      <h1 className="mt-5">{home.product}</h1>
      <div class="h-100 mt-5 p-5 text-bg-dark rounded-3">
        <p className="mb-0">Product/Service price - ${home.productPrice}</p>
        <p className="mb-0">
          Percentage off original price - ${home.percentageOff}
        </p>
        <p className="mb-0">
          New product price - $
          {(
            home.productPrice -
            (home.percentageOff / 100) * home.productPrice
          ).toFixed(2)}
        </p>
        <p>Voucher price - ${home.price}</p>

        <div class="jumbotron  pt-3">
          <div>
            <i>Know more....</i>
          </div>
          <p>{home.description}</p>
          <div className="row">
            <div className="col-sm-1"></div>
            <div className="col-sm-1"></div>
            <div className="col-sm-1"></div>
            <div className="col-sm-1"></div>
            <div className="col-sm-1"></div>
            <div className="col-sm-1"></div>
            <div className="col-sm-1"></div>
            <div className="col-sm-1"></div>
            <div className="col-sm-1"></div>
            <div className="col-sm-1"></div>
            <div className="col-sm-1"></div>
            <div className="col-sm-1">
              <button
                onClick={() => doRequest()}
                className="btn btn-warning float-right"
              >
                Purchase
              </button>
            </div>
          </div>
        </div>
      </div>

      {errors}
    </div>
  );
};
HomeShow.getInitialProps = async (context, client) => {
  const { homeId } = context.query;
  const { data } = await client.get(`/api/homes/${homeId}`);

  return { home: data };
};

export default HomeShow;
