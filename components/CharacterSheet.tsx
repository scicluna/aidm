
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { PlayerBlock } from "@/utils/player";
import { ScrollArea } from "@radix-ui/react-scroll-area";

type characterSheetProps = {
    player: PlayerBlock
}

export default function CharacterSheet({ player }: characterSheetProps) {
    return (
        <Sheet>
            <SheetTrigger className='fixed bottom-0 left-2 p-2 h-[10dvh] text-2xl font-extrabold  underline dark:text-gray-100 hover:dark:text-gray-300 hover:text-gray-600'>Character Sheet</SheetTrigger>
            <SheetContent side={'bottom'} className='h-[20dvh] bg-slate-900'>
                <SheetHeader>
                    <SheetDescription>
                        <div className='flex gap-8'>
                            <div className='flex flex-col text-justify'>
                                <SheetTitle>Abilities</SheetTitle>
                                <p>str: {player.str} ({Math.floor((player.str - 10) / 2)})</p>
                                <p>dex: {player.dex} ({Math.floor((player.dex - 10) / 2)})</p>
                                <p>con: {player.con} ({Math.floor((player.con - 10) / 2)})</p>
                                <p>int: {player.int} ({Math.floor((player.int - 10) / 2)})</p>
                                <p>wis: {player.wis} ({Math.floor((player.wis - 10) / 2)})</p>
                                <p>cha: {player.cha} ({Math.floor((player.cha - 10) / 2)})</p>
                            </div>
                            <div className='flex flex-col text-justify'>
                                <SheetTitle>Attributes</SheetTitle>
                                <p>hp: {player.hp}/{player.hp}</p>
                                <p>ac: {player.ac}</p>
                                <p>atk: {player.atk}</p>
                                <p>dmg: {player.dmg}</p>
                                <p>wpn: {player.wpn}</p>
                                <p>armor: {player.armor}</p>
                            </div>
                            <div className='flex flex-col text-justify overflow-y-auto'>
                                <SheetTitle>Specials</SheetTitle>
                                <ScrollArea>
                                    {player.otherAbilities && player.otherAbilities.map(ability => (
                                        <p key={ability}>{ability}</p>
                                    ))}
                                </ScrollArea>
                            </div>
                            <div className='flex flex-col text-justify flex-wrap overflow-y-auto'>
                                <SheetTitle>Inventory</SheetTitle>
                                <ScrollArea>
                                    {player.inventory && player.inventory.map(item => (
                                        <p key={item.item} className='w-fit'> {item.quantity}x {item.item} {item.type} {item.stat ?? null}</p>
                                    ))}
                                </ScrollArea>
                            </div>
                            <div className='flex flex-col text-justify overflow-y-auto'>
                                <SheetTitle>Journal</SheetTitle>
                                <ScrollArea>
                                    {player.journal && player.journal.map(entry => (
                                        <p key={entry.number}>{entry.entry}</p>
                                    ))}
                                </ScrollArea>
                            </div>
                        </div>
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}
