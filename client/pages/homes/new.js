import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const NewHome = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [percentageOff, setPercentageOff] = useState('');
  const [price, setPrice] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/homes',
    method: 'post',
    body: {
      title,
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
    <div>
      <h1>Create a Home</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Percentage Off</label>
          <input
            value={percentageOff}
            onChange={(e) => setPercentageOff(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        <br />
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewHome;
