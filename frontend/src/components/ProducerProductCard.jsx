import { useState } from "react";

function ProducerProductCard({ product, onUpdateQuantity, onUpdateProduct }) {
  const [qtyChange, setQtyChange] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    type: product.type,
    unit: product.unit,
  });

  const handleAdd = () =>
    onUpdateQuantity(product._id, product.quantity + Number(qtyChange));
  const handleRemove = () => {
    const newQty = product.quantity - Number(qtyChange);
    if (newQty < 0) return alert("Quantity cannot be negative");
    onUpdateQuantity(product._id, newQty);
  };

  const handleEdit = () => {
    onUpdateProduct(product._id, editData);
    setIsEditing(false);
  };

  return (
    <div className="producer-product-card">
      <div className="ppc-header">
        <img
          className="ppc-image"
          src={`http://img.spoonacular.com/ingredients_100x100/${product.image}`}
          alt={product.name}
        />
        <div className="ppc-title">
          <p className="ppc-name">{product.name}</p>
          <p className="ppc-type">{product.type}</p>
          <p
            className={`ppc-qty ${
              product.quantity === 0 ? "out-of-stock" : ""
            }`}
          >
            Stock: {product.quantity} {product.unit}
          </p>
          <p className="ppc-price">
            {product.price}€/{product.unit}
          </p>
        </div>
      </div>

      {/* QTY CONTROLS */}
      <div className="prod-qty-buttons">
        <select
          className="ppc-qty-select"
          value={qtyChange}
          onChange={(e) => setQtyChange(e.target.value)}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <button className="prod-btn-add-one btn btn--primary" onClick={handleAdd}>
          +
        </button>
        <button className="prod-btn-remove-one btn btn--destructive" onClick={handleRemove}>
          -
        </button>
      </div>

      {/* EDIT */}
      <button className="prod-btn-edit btn btn--ghost" onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? "Cancel" : "Edit product"}
      </button>

      {isEditing && (
        <div className="product-edit-form">
          <div className="edit-btn-container">
          <button className="btn-product-save-changes btn btn--primary" onClick={handleEdit}>
            Save changes
          </button>
          </div>
          <input
            className="input"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            placeholder="Name"
          />
          <input
            className="input"
            value={editData.description}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
            placeholder="Description"
          />
          <input
            className="input"
            type="number"
            value={editData.price}
            onChange={(e) =>
              setEditData({ ...editData, price: e.target.value })
            }
            placeholder="Price"
          />
          <select
            className="dropdown"
            value={editData.type}
            onChange={(e) => setEditData({ ...editData, type: e.target.value })}
          >
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Dry">Dry</option>
            <option value="Frozen">Frozen</option>
            <option value="Liquid">Liquid</option>
          </select>
          <select
            className="dropdown"
            value={editData.unit}
            onChange={(e) => setEditData({ ...editData, unit: e.target.value })}
          >
            <option value="Kg">Kg</option>
            <option value="Lt">Lt</option>
            <option value="Gr">Gr</option>
            <option value="Cl">Cl</option>
            <option value="Piece">Piece</option>
          </select>
          
          
        </div>
      )}
    </div>
  );
}

export default ProducerProductCard;
