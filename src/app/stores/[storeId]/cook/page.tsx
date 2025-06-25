"use client";

import { useEffect, useRef, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MoreVertical, Plus } from "lucide-react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

type Order = RouterOutputs["order"]["getOrders"][number];
type Orders = Order[] | undefined;

type List = Order["itemList"];

type OrderWithStation = Order & { isCurStationDone: boolean };

type StationInput = { stationName: string };

const QPARAM = "stationId";

export default function Page() {
	const useQP = useQueryParam();
	return (
		<div className="flex h-full flex-col">
			<div className="flex flex-row justify-between p-4 text-2xl">
				<StationSelect {...useQP} />
				<StationMenu {...useQP} />
			</div>
			<OrderList />
		</div>
	);
}

// paginated orders hourly, completed or not,
// TODO: optimize with react-window OR virtualized
function OrderList() {
	const q = useQueryParam();
	const utils = api.useUtils();
	const orders = api.order.getOrders.useQuery();
	const [orderList, setOrderList] = useState<OrderWithStation[] | undefined>();
	const setDone = api.order.setStaionDone.useMutation({
		onSuccess(data, variables) {
			utils.order.getOrders.setData(undefined, (prev) => {
				return _setStationDone(prev, variables.orderId, variables.stationId);
			});
		},
	});
	useEffect(() => {
		let a = _filterByStation(orders.data, q.stationId);
		const { orders: updateOrders } = _sortDone(a);

		setOrderList(updateOrders);
	}, [orders.data, q.stationId]);

	return (
		<div className="grid h-full snap-x snap-mandatory grid-flow-col grid-rows-1 gap-2 overflow-x-scroll md:gap-4">
			{orderList?.map((order) => {
				return (
					<Card
						key={`orderId_${order.id}`}
						className="flex h-[calc(100%-1rem)] w-[calc(100vw-2rem)] snap-center flex-col first:ml-4 last:mr-4 md:w-[calc(20vw)] md:snap-start md:scroll-ml-2 md:last:mr-[75vw]"
					>
						<CardHeader>
							<CardTitle className="flex justify-between">
								{order.id}_<span>{order.name}</span>
							</CardTitle>
							<CardDescription className="flex justify-between">
								<span>{order.type}</span>
								<span>
									{order.createdAt}_{order.isCurStationDone ? "done" : "no"}
								</span>
							</CardDescription>
						</CardHeader>
						<CardContent className="grid flex-1 grid-cols-1 overflow-y-scroll">
							<div>
								{order.itemList?.map((subList, subListIdx) => {
									return (
										<div className="border-b-2" key={`subList${subListIdx}`}>
											{subList.map((item, idx) => {
												return (
													<div key={`itemId_${item.id}_${idx}`}>
														<span>{item.qty}</span>
														<span className="ml-1">{item.name}</span>
														{item.stations.map((station) => {
															return `${station.name}_${station.id}`;
														})}
													</div>
												);
											})}
										</div>
									);
								})}
							</div>
						</CardContent>
						<CardFooter className="justify-end">
							<Button
								onClick={() => {
									setDone.mutate({ orderId: order.id, stationId: q.stationId });
								}}
							>
								done
							</Button>
						</CardFooter>
					</Card>
				);
			})}
		</div>
	);
}

function StationSelect({
	resetQueryParam,
	setQueryParam,
	stationId,
}: ReturnType<typeof useQueryParam>) {
	const stations = api.station.get.useQuery();
	const [isOpen, setIsOpen] = useState(false);

	function setSelectValue(val: string) {
		if (val === "_") {
			resetQueryParam();
		} else {
			setQueryParam(val);
		}
	}

	return (
		<>
			<Select
				onValueChange={(value) => {
					setSelectValue(value);
				}}
				defaultValue="_"
			>
				<SelectTrigger className="font-semibol w-[180px] text-xl">
					<SelectValue placeholder="station">
						{stationId && stations.data
							? stations.data.find((r) => r.id === stationId)?.name
							: "All"}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="_">All</SelectItem>
					{stations.data?.map((station) => {
						return (
							<SelectItem key={station.id} value={`${station.id}`}>
								{station.name}
							</SelectItem>
						);
					})}
					<div
						className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm text-muted-foreground outline-none"
						onClick={() => {
							setIsOpen(true);
						}}
					>
						+ add station
					</div>
				</SelectContent>
			</Select>
			<StationCreate isOpen={isOpen} setIsOpen={setIsOpen} />
		</>
	);
}

function StationCreate({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}) {
	const form = useForm<StationInput>();
	const stationCreate = api.station.create.useMutation();
	const utils = api.useUtils();
	const onSubmit: SubmitHandler<StationInput> = (data) => {
		stationCreate.mutate(
			{ name: data.stationName },
			{
				onSuccess() {
					void utils.station.get.invalidate();
					form.reset();
					setIsOpen(false);
				},
			},
		);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Station</DialogTitle>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="stationName" className="text-right">
								Name
							</Label>
							<Input
								className="col-span-3"
								id="stationName"
								placeholder="Station Name"
								{...form.register("stationName", { required: true })}
							/>
						</div>
					</div>
					<DialogFooter className="justify-center gap-2">
						<DialogClose asChild>
							<Button variant="destructive">cancel</Button>
						</DialogClose>
						<Button type="submit">create</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function StationMenu({
	resetQueryParam,
	stationId,
}: Omit<ReturnType<typeof useQueryParam>, "setQueryParam">) {
	const [isOpen, setIsOpen] = useState(false);
	const util = api.useUtils();
	const d = api.station.delete.useMutation({
		onSuccess: async () => {
			resetQueryParam();
			await util.station.get.invalidate();
		},
	});

	if (!stationId) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<MoreVertical />
			</DropdownMenuTrigger>

			<DropdownMenuPortal>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={() => {
						setIsOpen(true);
					}}>delete</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenuPortal>
			<Dialog open={isOpen} onOpenChange={(isOpen) => {
				setIsOpen(isOpen);
			}}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are You Sure?</DialogTitle>
					</DialogHeader>
					<DialogDescription >
						This will cause items to lose<br />relationship to the station
					</DialogDescription>
					<DialogFooter className="justify-center gap-2">
						<DialogClose asChild>
							<Button>cancel</Button>
						</DialogClose>
						<DialogClose asChild>
							<Button variant="destructive" onClick={() => {
								if (stationId) {
									d.mutate({ stationId: stationId });
								}
							}}>delete</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</DropdownMenu >
	);
}

function useQueryParam() {
	// TODO: component update colliding with query param update
	//   Cannot update a component (`Page`) while rendering a different component (`StationSelect`).
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const stationId = searchParams.get(QPARAM);

	function resetQueryParam() {
		router.replace(pathname);
	}

	function setQueryParam(val: string) {
		router.replace(`${pathname}?${QPARAM}=${val}`);
	}

	return {
		resetQueryParam,
		setQueryParam,
		stationId: stationId ? Number(stationId) : undefined,
	};
}

function _setStationDone(
	orders: Orders,
	orderId: number,
	stationId: number | undefined,
): Orders {
	return orders?.map((order) => {
		if (orderId !== order.id) return order;

		return {
			...order,
			list: order.itemList.map((subList) => {
				return subList.map((item) => {
					if (!stationId) {
						return { ...item, isServed: true };
					}
					return {
						...item,
						stations: item.stations.map((station) => {
							if (stationId !== station.id) {
								return station;
							}
							return { ...station, isDone: true };
						}),
					};
				});
			}),
		};
	});
}

// sortDone(orders: OrderWithStation[] | undefined):
// (number | undefined)[] |
// (number | OrderWithStation[])[]

function _sortDone(orders: OrderWithStation[] | undefined) {
	let tempDoneOrders: OrderWithStation[] = [];
	let tempStillOrders: OrderWithStation[] = [];

	if (!orders) {
		const index = -1;
		return { orders, index };
	}

	orders.forEach((order) => {
		if (order.isCurStationDone) {
			tempDoneOrders.push(order);
		} else {
			tempStillOrders.push(order);
		}
	});
	const index = tempDoneOrders.length;
	const arr = [...tempDoneOrders, ...tempStillOrders];
	return { orders: arr, index };
}

function _filterByStation(
	orders: Orders | undefined,
	stationId: number | undefined,
): OrderWithStation[] | undefined {
	if (!orders) return undefined;

	if (!stationId) {
		return orders.map((order) => {
			return {
				...order,
				isCurStationDone: order.itemList.every((r) => r.every((v) => v.isServed)),
			};
		});
	}

	//   let temporders

	const tempOrders = orders.map((order) => {
		let stations: boolean[] = [];
		const tempList = order.itemList.map((items) => {
			const tempItems = items.filter((item) =>
				item.stations.find((station) => {
					if (station.id === stationId) {
						stations.push(station.isDone);
						return true;
					}
					return false;
				}),
			);

			if (tempItems.length > 0) {
				return tempItems;
			}
			return undefined;
		});
		let b: List = [];

		tempList.forEach((r) => {
			if (r) {
				b.push(r);
			}
		});

		return {
			...order,
			list: b,
			isCurStationDone: stations.every((r) => r),
		};
	});

	return tempOrders.filter((ol) => ol.list.length > 0);
}

