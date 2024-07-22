import React from 'react';

const ItemCard = ({ title, content, onEdit, onDelete, url }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      {url ? (
        <p className="text-blue-500 mb-4">
          <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
            Watch
          </a>
        </p>
      ) : (
        <p className="text-gray-600 mb-4">{content}</p>
      )}
      <div className="flex justify-end space-x-2">
        <button
          onClick={onEdit}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
