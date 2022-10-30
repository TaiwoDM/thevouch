import useRequest from '../../hooks/use-request';
import Router from 'next/router';
import Link from 'next/link';

const VoucherShow = ({ voucher }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      voucherId: voucher.id,
    },
    onSuccess: (order) => {
      Router.push('/orders/[orderId]', `/orders/${order.id}`);
    },
  });

  return (
    <div className="container">
      <h1 className="mt-5">{voucher.product}</h1>
      <div className="h-100 mt-5 p-5 text-bg-dark rounded-3">
        <p className="mb-0">Product/Service price - ${voucher.productPrice}</p>
        <p className="mb-0">
          Percentage off original price - {voucher.percentageOff}%
        </p>
        <p className="mb-0">
          New product price - $
          {(
            voucher.productPrice -
            (voucher.percentageOff / 100) * voucher.productPrice
          ).toFixed(2)}
        </p>
        <p>Voucher price - ${voucher.price}</p>

        <div className="jumbotron  pt-3">
          <div>
            <i>Know more....</i>
          </div>
          <p>{voucher.description}</p>
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
VoucherShow.getInitialProps = async (context, client) => {
  const { voucherId } = context.query;

  const { data } = await client.get(`/api/vouchers/${voucherId}`);

  return { voucher: data };
};

export default VoucherShow;
