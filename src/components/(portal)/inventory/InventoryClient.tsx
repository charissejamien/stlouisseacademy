import MerchandiseInventory from "./MerchandiseInventory";
import ProcurementInventory from "./ProcurementInventory";

export default function InventoryClient() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <MerchandiseInventory />
      </div>
      <div>
        <ProcurementInventory />
      </div>
    </div>
  );
}
