import useLocalStorage from "use-local-storage";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    type DetailsData,
    detailsSchema,
    belongingsEnum,
    SPECIALTY_ITEMS,
} from "@/schemas/movingDetails.schema";

function MovingDetails() {
    const [data, setData] = useLocalStorage<DetailsData>("detailsData", {
        "belongings-going": "Everything's going",
        "specialty-items": [],
    });

    const form = useForm<DetailsData>({
        resolver: zodResolver(detailsSchema),
        defaultValues: data,
        mode: "onChange",
    });

    useEffect(() => {
        const subscription = form.watch((values) => {
            if (values) {
                setData(values as DetailsData);
            }
        });
        return () => subscription.unsubscribe();
    }, [form, setData]);

    function nextPage() {
        // Todo: Check to see if this is a larger or smaller job to suggest a efficency or supersized crew (then do the packing)
        // https://www.3mm.com/booking/supersize/
        //
        // For example, choosing a 3 bedroom home that is 1500-2000 sqft, has a 2 car garage, is 2 stories and everything is going
        //  will allow for the option to supersize your crew for a higher hourly rate.
        window.location.assign("/booking/payment");
    }

    return (
        <div>
            <h1>Please tell us more about your move.</h1>
            <Form {...form}>
                <form>
                    <FormField
                        control={form.control}
                        name="belongings-going"
                        render={({ field }) => (
                            <div className="py-4">
                                <h2>
                                    How much of your belongings are you moving? This does not
                                    impact pricing
                                </h2>
                                <div>
                                    <RadioGroup
                                        className="flex flex-row"
                                        defaultValue={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        {belongingsEnum.options.map((opt) => (
                                            <div key={opt}>
                                                <RadioGroupItem value={opt} id={opt} />
                                                <Label htmlFor={opt}>{opt}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            </div>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="specialty-items"
                        render={({ field }) => (
                            <FormItem className=" py-4">
                                <FormLabel>Any specialty items?</FormLabel>
                                <div className="flex flex-row">
                                    {SPECIALTY_ITEMS.filter((opt) => opt).map((opt) => (
                                        <div key={opt} className="flex items-center px-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value.includes(opt)}
                                                    onCheckedChange={(checked) =>
                                                        field.onChange(
                                                            checked
                                                                ? [...field.value, opt]
                                                                : field.value.filter((v) => v !== opt),
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <Label className="ml-2">{opt}</Label>
                                        </div>
                                    ))}
                                </div>
                            </FormItem>
                        )}
                    />
                    <Button type="button" onClick={nextPage}>
                        Continue
                    </Button>
                </form>
            </Form>
        </div>
    );
}
export default MovingDetails;
