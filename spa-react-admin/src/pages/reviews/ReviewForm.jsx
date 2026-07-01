import React from 'react';
import Modal from '../../components/Modal.jsx';
export default function ReviewForm({ fields, initial, onClose, onSubmit, lookups }) {
  return <Modal fields={fields} initial={initial} onClose={onClose} onSubmit={onSubmit} lookups={lookups} />;
}
