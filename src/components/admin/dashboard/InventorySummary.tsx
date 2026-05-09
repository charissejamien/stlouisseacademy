

export default function InventorySummary() {

    const inventory = [
        {merchandise: "Logo", price: 100, status: "In Stock"},
        {merchandise: "Upper Cloth", price: 100 , status: "Low Stock"},
        {merchandise: "Lower Cloth", price: 100 , status: "In Stock"},
        {merchandise: "PE Shirt", price: 100, status: "Low Stock"},
        {merchandise: "PE Pants", price: 100, status: "In Stock"},

    ]

    return(
        <div className="bg-white p-5 rounded-md shadow-xs">
            <div>
                {inventory.map((i , index) => (
                    <div key={index} className="py-2 flex gap-10 ">
                        <p className="w-50">{i.merchandise}</p>
                        <p className="w-30">{i.price}</p>
                        <p>{i.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}