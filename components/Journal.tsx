import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetDescription, SheetTitle } from "./ui/sheet";

type JournalProps = {
    name: string
    journal: {
        number: number
        entry: string
    }[]
}

export default function Journal({ name, journal }: JournalProps) {
    return (
        <Sheet>
            <SheetTrigger className='fixed bottom-0 right-2 p-2 h-[10dvh] text-2xl font-extrabold  underline dark:text-gray-100 hover:dark:text-gray-300 hover:text-gray-600'>Journal</SheetTrigger>
            <SheetContent side={'right'} className='w-[20dvw] bg-slate-900'>
                <SheetHeader>
                    <SheetDescription>
                        <div className='flex flex-col justify-center items-center'>
                            <SheetTitle>{name}'s Journal</SheetTitle>
                            <div className="flex flex-col gap-2">
                                {journal.map(entry => (
                                    <p key={entry.number}>{entry.number}. {entry.entry}</p>
                                ))}
                            </div>
                        </div>
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}