
import FeesList from "@/components/feesList";
import FeesInput from "@/components/fees";
import Discounts from "@/components/discounts";
import DiscountsList from "@/components/discountsList";

export default function Fees() {



    return(
        <div>
            <FeesInput/>
            <Discounts/>
            <DiscountsList/>
            <FeesList/>
        </div>
    );
}