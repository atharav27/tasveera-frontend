"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, X, Check } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import {
    DialogWrapper,
    CommonAlertDialog,
    FormDatePickerField,
    FormInputField,
    FormSelectField,
    FormTextareaField,
    FormTimePickerField,
    Label,
    Button,
    Badge,
    Input,
    DialogFooter,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@corpora/ui";

import {
    useBookingTags,
    useEmployeeSearch,
    useCreateBooking,
    useUpdateBooking,
    useBookingDetails,
    useAvailableVendors,
    useAssignVendor,
    VehicleClass,
    RideType,
    PassengerType,
    Employee,
} from "@/hooks/use-bookings";
import { useSession } from "@/lib/auth-client";
import { createBookingSchema, type CreateBookingFormData } from "./schemas/create-booking-schema";

interface CreateBookingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bookingId?: string;
}

const VEHICLE_CLASSES: { label: string; value: VehicleClass }[] = [
    { label: "Hatchback", value: "hatchback" },
    { label: "Sedan", value: "sedan" },
    { label: "Sedan Premium", value: "sedan_premium" },
    { label: "SUV", value: "suv" },
    { label: "SUV Premium", value: "suv_premium" },
    { label: "MUV", value: "muv" },
    { label: "Tempo Traveller 12", value: "tempo_traveller_12" },
    { label: "Tempo Traveller 17", value: "tempo_traveller_17" },
    { label: "Tempo Traveller 26", value: "tempo_traveller_26" },
    { label: "Mini Bus", value: "mini_bus" },
    { label: "Bus 35", value: "bus_35" },
    { label: "Bus 45", value: "bus_45" },
    { label: "Luxury", value: "luxury" },
];

const RIDE_TYPES: { label: string; value: RideType }[] = [
    { label: "Local", value: "local" },
    { label: "Outstation", value: "outstation" },
    { label: "Package", value: "package" },
];

const PASSENGER_TYPES: { label: string; value: PassengerType }[] = [
    { label: "Employee", value: "employee" },
    { label: "Guest", value: "guest" },
    { label: "VIP", value: "vip" },
];

const GENDER_OPTIONS = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
    { label: "Prefer not to say", value: "prefer_not_to_say" },
];

const GOVT_ID_TYPES = [
    { label: "Aadhaar", value: "aadhaar" },
    { label: "PAN", value: "pan" },
    { label: "Voter ID", value: "voter_id" },
    { label: "Driving License", value: "driving_license" },
    { label: "Passport", value: "passport" },
];

export function CreateBookingModal({ open, onOpenChange, bookingId }: CreateBookingModalProps) {
    const router = useRouter();
    const [step, setStep] = React.useState<1 | 2>(1);
    const [createdBookingId, setCreatedBookingId] = React.useState<string | null>(null);
    const [createdBookingNumber, setCreatedBookingNumber] = React.useState<string>("");
    const [employeeSearchTerm, setEmployeeSearchTerm] = React.useState("");
    const [showEmployeeDropdown, setShowEmployeeDropdown] = React.useState(false);
    const [successDialogOpen, setSuccessDialogOpen] = React.useState(false);

    const isEdit = !!bookingId;
    const activeBookingId = bookingId || createdBookingId;

    // Session & Corporate ID
    const { data: session } = useSession();
    const corporateId = (session?.user as { corporateId?: string } | undefined)?.corporateId;

    // Hooks
    const { tags } = useBookingTags();
    const { search: searchEmployees, employees, isLoading: isSearchingEmployees } = useEmployeeSearch(corporateId || "");
    const { create: apiCreateBooking, isCreating } = useCreateBooking();
    const { update: apiUpdateBooking, isUpdating } = useUpdateBooking();
    const { data: bookingDetails, isLoading: isLoadingDetails } = useBookingDetails(bookingId);
    const { vendors, fetchVendors, isLoading: isLoadingVendors } = useAvailableVendors(activeBookingId || undefined);
    const { assign: apiAssignVendor, isAssigning } = useAssignVendor();

    const form = useForm<CreateBookingFormData>({
        resolver: zodResolver(createBookingSchema),
        defaultValues: {
            rideType: "local",
            passengerType: "employee",
            tagIds: [],
            pickupLocation: { latitude: 28.6139, longitude: 77.209 },
            passengerGender: "male",
            governmentIdType: "aadhaar",
            passengerName: "",
            passengerPhone: "",
            passengerEmail: "",
            employeeId: "",
            governmentId: "",
            pickupAddress: "",
            pickupLandmark: "",
            dropAddress: "",
            dropLandmark: "",
            vehicleClass: "",
            scheduledPickupTime: new Date(),
            specialInstructions: "",
        },
    });

    const selectedPassengerType = useWatch({ control: form.control, name: "passengerType" });
    const selectedTagIds = useWatch({ control: form.control, name: "tagIds" });

    // Pre-fill form when editing
    React.useEffect(() => {
        if (isEdit && bookingDetails) {
            const primaryPassenger = bookingDetails.passengers?.[0];
            form.reset({
                rideType: bookingDetails.rideType,
                vehicleClass: bookingDetails.vehicleClass,
                scheduledPickupTime: new Date(bookingDetails.scheduledPickupTime),
                pickupAddress: bookingDetails.pickupAddress,
                pickupLocation: bookingDetails.pickupLocation,
                dropAddress: bookingDetails.dropAddress || "",
                dropLocation: bookingDetails.dropLocation,
                passengerType: (primaryPassenger?.passengerType as PassengerType) || "employee",
                passengerName: primaryPassenger?.name || "",
                passengerPhone: primaryPassenger?.phone || "",
                passengerEmail: primaryPassenger?.email || "",
                specialInstructions: bookingDetails.specialInstructions || "",
                tagIds: bookingDetails.tagIds || [],
                pickupLandmark: bookingDetails.pickupLandmark || "",
                dropLandmark: bookingDetails.dropLandmark || "",
                passengerGender: (primaryPassenger?.gender as CreateBookingFormData["passengerGender"]) || "male",
                governmentId: primaryPassenger?.governmentId || "",
                governmentIdType: (primaryPassenger?.governmentIdType as CreateBookingFormData["governmentIdType"]) || "aadhaar",
                employeeId: primaryPassenger?.employeeId || "",
            });
        }
    }, [isEdit, bookingDetails, form]);

    // Handle employee search
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (employeeSearchTerm.length >= 2 && corporateId) {
                searchEmployees(employeeSearchTerm);
                setShowEmployeeDropdown(true);
            } else {
                setShowEmployeeDropdown(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [employeeSearchTerm, searchEmployees, corporateId]);

    const onSubmit = async (values: CreateBookingFormData) => {
        try {
            const {
                passengerName,
                passengerPhone,
                passengerEmail,
                passengerType,
                employeeId,
                passengerGender,
                governmentId,
                governmentIdType,
                ...rootValues
            } = values;

            const payload = {
                ...rootValues,
                scheduledPickupTime: values.scheduledPickupTime.toISOString(),
                passengers: [
                    {
                        name: passengerName,
                        phone: passengerPhone,
                        email: passengerEmail,
                        passengerType: passengerType,
                        employeeId: employeeId,
                        gender: passengerGender,
                        governmentId: governmentId,
                        governmentIdType: governmentIdType,
                    },
                ],
            };

            if (isEdit && bookingId) {
                const response = (await apiUpdateBooking(bookingId, payload)) as { success: boolean };
                if (response.success) {
                    onOpenChange(false);
                    resetForm();
                }
            } else {
                const response = (await apiCreateBooking(payload)) as {
                    success: boolean;
                    data: { id: string; bookingNumber: string };
                };
                if (response.success) {
                    setCreatedBookingId(response.data.id);
                    setCreatedBookingNumber(response.data.bookingNumber);
                    setStep(2);
                    fetchVendors(response.data.id);
                }
            }
        } catch (error) {
            console.error("Booking operation failed:", error);
        }
    };

    const handleAssignVendor = async (vendorId: string, isFallback: boolean) => {
        if (!createdBookingId) return;
        try {
            const response = (await apiAssignVendor(createdBookingId, {
                vendorId,
                useFallback: isFallback,
            })) as { success: boolean };
            if (response.success) {
                onOpenChange(false);
                resetForm();
                setSuccessDialogOpen(true);
            }
        } catch (error) {
            console.error("Vendor assignment failed:", error);
        }
    };

    const handleCancel = () => {
        resetForm();
        onOpenChange(false);
    };

    const resetForm = () => {
        setStep(1);
        setCreatedBookingId(null);
        setCreatedBookingNumber("");
        setEmployeeSearchTerm("");
        setShowEmployeeDropdown(false);
        form.reset();
    };

    const handleViewBooking = () => {
        setSuccessDialogOpen(false);
        if (createdBookingId) {
            router.push(`/bookings/${createdBookingId}?new=true`);
        }
    };

    const handleEmployeeSelect = (emp: Employee) => {
        form.setValue("passengerName", emp.name);
        form.setValue("passengerPhone", emp.phone || "");
        form.setValue("passengerEmail", emp.email);
        form.setValue("employeeId", emp.employeeId || "");
        setEmployeeSearchTerm(emp.name);
        setShowEmployeeDropdown(false);
    };

    const handleTagRemove = (tagId: string) => {
        const current = selectedTagIds || [];
        form.setValue(
            "tagIds",
            current.filter((id) => id !== tagId)
        );
    };

    const formContent = (
        <form id="booking-modal-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-6 gap-x-4 md:gap-x-8">
                <FormSelectField
                    control={form.control}
                    name="rideType"
                    label="Trip Type"
                    placeholder="Select Trip Type"
                    options={RIDE_TYPES}
                />
                <FormSelectField
                    control={form.control}
                    name="vehicleClass"
                    label="Vehicle Class"
                    placeholder="Select vehicle type"
                    options={VEHICLE_CLASSES}
                />
                <FormSelectField
                    control={form.control}
                    name="passengerType"
                    label="Passenger Type"
                    placeholder="Select passenger type"
                    options={PASSENGER_TYPES}
                />

                {selectedPassengerType === "employee" && (
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs md:text-sm text-slate-900 font-medium">Search Employee</Label>
                        <div className="relative">
                            <Input
                                placeholder="Search by ID or Name"
                                value={employeeSearchTerm}
                                onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                                onFocus={() => employeeSearchTerm.length >= 2 && setShowEmployeeDropdown(true)}
                                className="w-full text-xs md:text-sm text-slate-900 font-normal no-focus-outline py-4 md:py-5 rounded-md shadow-none"
                            />
                            {isSearchingEmployees && (
                                <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                            )}
                            {showEmployeeDropdown && employees.length > 0 && (
                                <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-auto">
                                    {employees.map((emp) => (
                                        <div
                                            key={emp.id}
                                            className="p-2 hover:bg-slate-50 cursor-pointer text-sm"
                                            onClick={() => handleEmployeeSelect(emp)}
                                        >
                                            {emp.name} ({emp.employeeId})
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {selectedPassengerType !== "employee" && (
                    <FormInputField control={form.control} name="passengerName" label="Passenger Name" placeholder="Enter name" />
                )}

                <FormInputField
                    control={form.control}
                    name="passengerPhone"
                    label="Contact Number"
                    placeholder="10-15 digits"
                    type="tel"
                />

                <FormInputField
                    control={form.control}
                    name="passengerEmail"
                    label="Email (Optional)"
                    placeholder="email@company.com"
                    optional
                />

                <FormSelectField
                    control={form.control}
                    name="passengerGender"
                    label="Gender"
                    placeholder="Select gender"
                    options={GENDER_OPTIONS}
                />

                <FormSelectField
                    control={form.control}
                    name="governmentIdType"
                    label="Govt ID Type"
                    placeholder="Select ID Type"
                    options={GOVT_ID_TYPES}
                />

                <FormInputField
                    control={form.control}
                    name="governmentId"
                    label="Govt ID Number"
                    placeholder="Enter ID number"
                    optional
                />

                <FormInputField
                    control={form.control}
                    name="pickupAddress"
                    label="Pickup Location"
                    placeholder="Enter pickup address"
                />

                <FormInputField
                    control={form.control}
                    name="pickupLandmark"
                    label="Pickup Landmark"
                    placeholder="Near Landmark (optional)"
                    optional
                />

                <FormInputField
                    control={form.control}
                    name="dropAddress"
                    label="Drop-Off Location"
                    placeholder="Enter drop-off address"
                    optional
                />

                <FormInputField
                    control={form.control}
                    name="dropLandmark"
                    label="Drop-Off Landmark"
                    placeholder="Near Landmark (optional)"
                    optional
                />
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                <div className="flex-1">
                    <FormDatePickerField
                        control={form.control}
                        name="scheduledPickupTime"
                        label="Date & Time"
                        placeholder="Pick a date"
                    />
                </div>
                <div className="flex-1 md:mt-1.5">
                    <FormTimePickerField
                        control={form.control}
                        name="scheduledPickupTime"
                        label="Time"
                        placeholder="13:00"
                        hideLabel
                        onChange={(timeStr) => {
                            const [hours, minutes] = timeStr.split(':');
                            const currentDate = form.getValues("scheduledPickupTime") || new Date();
                            const newDate = new Date(currentDate);
                            newDate.setHours(parseInt(hours || '0'), parseInt(minutes || '0'));
                            form.setValue("scheduledPickupTime", newDate, { shouldValidate: true, shouldDirty: true });
                        }}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Label className="text-xs md:text-sm text-slate-900 font-medium">Tags</Label>
                {selectedTagIds && selectedTagIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {selectedTagIds.map((id: string) => {
                            const tag = tags.find((t) => t.id === id);
                            return tag ? (
                                <Badge key={id} variant="secondary" className="gap-1">
                                    {tag.name}
                                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleTagRemove(id)} />
                                </Badge>
                            ) : null;
                        })}
                    </div>
                )}
                <Select
                    onValueChange={(v) => {
                        const current = form.getValues("tagIds") || [];
                        if (!current.includes(v)) {
                            form.setValue("tagIds", [...current, v]);
                        }
                    }}
                    value=""
                >
                    <SelectTrigger className="w-full text-xs md:text-sm text-slate-900 font-normal no-focus-outline py-4 md:py-5 rounded-md shadow-none">
                        <SelectValue placeholder="Add Tags" />
                    </SelectTrigger>
                    <SelectContent>
                        {tags.map((tag) => (
                            <SelectItem key={tag.id} value={tag.id}>
                                {tag.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <FormTextareaField
                control={form.control}
                name="specialInstructions"
                label="Special Instructions"
                placeholder="Any special requirements or notes...."
            />

            <DialogFooter className="sticky bottom-0 bg-white pt-4 pb-0">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isCreating || isUpdating}
                    className="rounded-full py-6 px-8"
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isCreating || isUpdating} className="rounded-full py-6 px-12">
                    {isCreating || isUpdating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {isEdit ? "Updating..." : "Creating..."}
                        </>
                    ) : isEdit ? (
                        "Update Booking"
                    ) : (
                        "Create Booking"
                    )}
                </Button>
            </DialogFooter>

            {isLoadingDetails && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            )}
        </form>
    );

    const vendorContent = (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Corporate Vendors (Preferred)</h3>
                {vendors.corporateVendors.length > 0 ? (
                    <div className="grid gap-3">
                        {vendors.corporateVendors.map((vendor) => (
                            <button
                                key={vendor.id}
                                onClick={() => handleAssignVendor(vendor.id, false)}
                                disabled={isAssigning}
                                className="flex items-center justify-between p-4 border rounded-xl hover:bg-accent transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div>
                                    <p className="font-semibold">{vendor.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        SLA: {vendor.slaScore}% • Fleet: {vendor.fleetSize}
                                    </p>
                                </div>
                                <Check className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground italic">No corporate vendors available.</p>
                )}
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Fallback Vendors</h3>
                <div className="grid gap-3">
                    {vendors.fallbackVendors.map((vendor) => (
                        <button
                            key={vendor.id}
                            onClick={() => handleAssignVendor(vendor.id, true)}
                            disabled={isAssigning}
                            className="flex items-center justify-between p-4 border rounded-xl hover:bg-accent transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div>
                                <p className="font-semibold">{vendor.name}</p>
                                <p className="text-xs text-muted-foreground">Emergency backup</p>
                            </div>
                            <Check className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                        </button>
                    ))}
                </div>
            </div>

            {isLoadingVendors && (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}

            <DialogFooter className="sticky bottom-0 bg-white pt-4 pb-0">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    disabled={isAssigning}
                    className="w-full rounded-full py-6"
                >
                    Back to Details
                </Button>
            </DialogFooter>
        </div>
    );

    return (
        <>
            <DialogWrapper
                open={open}
                onOpenChange={(o) => {
                    onOpenChange(o);
                    if (!o) resetForm();
                }}
                title={step === 2 ? "Assign Vendor" : isEdit ? "Update Booking" : "Create New Booking"}
                description={step === 1 ? "Fill in the details to create a new Trip booking" : "Select a vendor for your booking"}
                content={step === 1 ? formContent : vendorContent}
                maxWidth="xl"
                showCloseButton={true}
            />

            <CommonAlertDialog
                open={successDialogOpen}
                onOpenChange={setSuccessDialogOpen}
                ImageComponent={Image}
                variant="success"
                title="Booking Created Successfully!!"
                subtitle={`Booking ID ${createdBookingNumber || "N/A"} has been confirmed. We'll notify you once the assigned vendor accepts your Trip.`}
                buttons={[
                    {
                        label: "View Booking",
                        onClick: handleViewBooking,
                        variant: "link",
                    },
                ]}
            />
        </>
    );
}
