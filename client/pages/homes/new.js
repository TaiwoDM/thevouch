import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const NewHome = () => {
  const [product, setProduct] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [description, setDescription] = useState('');
  const [percentageOff, setPercentageOff] = useState('');
  const [price, setPrice] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/homes',
    method: 'post',
    body: {
      product,
      productPrice,
      price,
      percentageOff,
      description,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  return (
    <div className="row">
      <form onSubmit={onSubmit} className="row col-lg-6 g-3 m-auto">
        <h1>New Voucher</h1>
        <div className="form-group col-12">
          <label className="form-label">Product/Service</label>
          <input
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group col-md-4">
          <label className="form-label">Original price</label>
          <input
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group col-md-4">
          <label className="form-label">Percentage off</label>
          <input
            value={percentageOff}
            onChange={(e) => setPercentageOff(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group col-md-4">
          <label className="form-label">Voucher price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            style={{ height: '200px' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        <br />
        <button className="btn btn-primary w-25 ">Submit</button>
      </form>
    </div>
  );
};

export default NewHome;
