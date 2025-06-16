// import * as Dialog from "@radix-ui/react-dialog";
// import * as Tabs from "@radix-ui/react-tabs";

// import { Tabs as Tb, TabsContent, TabsList, TabsTrigger } from "~/components/shadcn/tabs"
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";

import { type SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ScrollArea } from "~/components/ui/scroll-area";

type Tax = RouterOutputs["tax"]["get"][number];
export default function StationModal({
	toggleTax,
	toggledTaxes,
}: {
	toggleTax: (tax: Tax) => void;
	toggledTaxes: Tax[];
}) {
	return (
		<Dialog
		// open={open}
		// onOpenChange={(isOpen) => {
		//   // abstract dialog & call "confirm close dialog"
		// }}
		>
			<DialogTrigger asChild>
				<Button className=" m-2 p-2">
					<Plus className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="h-[20rem]">
				<Tabs defaultValue="tab1">
					<DialogHeader>
						<DialogTitle>Taxes</DialogTitle>
						<DialogDescription>
							{/* <p className="text-center">Taxes</p> */}
							<TabsList className="mx-8 flex justify-center">
								<TabsTrigger
									value="tab1"
									className="data-[state=active]:underline"
								>
									new
								</TabsTrigger>
								<TabsTrigger
									value="tab2"
									className="data-[state=active]:underline"
								>
									assign
								</TabsTrigger>
							</TabsList>
						</DialogDescription>
					</DialogHeader>
					<TabsContent value="tab1">
						<TaxCreate />
					</TabsContent>
					<TabsContent value="tab2">
						<TaxAssign toggleTax={toggleTax} toggledTaxes={toggledTaxes} />
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}

type TaxInput = { taxName: string; taxPercent: string };
function TaxCreate() {
	const [] = useState();
	const form = useForm<TaxInput>();
	const taxCreate = api.tax.create.useMutation();

	const onSubmit: SubmitHandler<TaxInput> = (data) => {
		taxCreate.mutate(
			{ taxName: data.taxName, taxPercent: Number(data.taxPercent) },
			{
				onSuccess() {
					form.reset();
				},
			},
		);
	};

	return (
		<>
			<form
				className="grid gap-4 py-4"
				id="taxCreate"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="taxName" className="text-right">
						Name
					</Label>
					<Input
						id="taxName"
						placeholder="tax name"
						type="text"
						className="col-span-3"
						{...form.register("taxName", { required: true })}
					/>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="taxPercent" className="text-right">
						Tax %
					</Label>
					<Input
						id="taxPercent"
						placeholder="tax percent"
						type="number"
						className="col-span-3"
						{...form.register("taxPercent", {
							required: true,
							min: 0,
						})}
					/>
				</div>
			</form>
			<DialogFooter className="pt-auto mt-auto justify-center gap-2">
				<Button type="submit" form="taxCreate">
					create tax
				</Button>
			</DialogFooter>
		</>
	);
}

function TaxAssign({
	toggleTax,
	toggledTaxes,
}: {
	toggleTax: (tax: Tax) => void;
	toggledTaxes: Tax[];
}) {
	const taxes = api.tax.get.useQuery();
	const deleteTax = api.tax.delete.useMutation();

	return (
		<div>
			<ScrollArea className="h-[12rem] w-full flex-1 rounded-md border">
				{taxes.data?.map((v) => {
					return (
						<div key={v.id}>
							<Checkbox
								onCheckedChange={() => {
									toggleTax(v);
								}}
								id={"tax" + v.id}
								checked={!!toggledTaxes.find((r) => r.id === v.id)}
							/>
							<Label htmlFor={"tax" + v.id}>
								{v.name} - {v.percent}
							</Label>

							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button className="m-2 rounded p-2 outline">delete</Button>
								</AlertDialogTrigger>
								<AlertDialogContent className="w-80">
									<AlertDialogHeader>
										<AlertDialogTitle>Are you sure?</AlertDialogTitle>
										<AlertDialogDescription>
											All items referencing this tax will be affected.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => {
												deleteTax.mutate({ taxId: Number(v.id) });
											}}
										>
											Delete
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					);
				})}
			</ScrollArea>
		</div>
	);
}
