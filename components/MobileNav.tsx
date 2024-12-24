"use client"

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import { SignedIn, SignedOut, useClerk, UserButton, useUser } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "./ui/button"


const MobileNav = () => {
  const pathname = usePathname();
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  return (
    <section>
      <Sheet>
        <SheetTrigger>
          <Image src="/icons/hamburger.svg" width={30} height={30} alt="menu" className="cursor-pointer" />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-black-1">

          <SheetHeader className="sr-only">
            <SheetTitle className="sr-only">Mobile nav</SheetTitle>
            <SheetDescription className="sr-only">Mobile nav</SheetDescription>
          </SheetHeader>

          <Link href="/">
            <SheetClose className="flex cursor-pointer items-center gap-1 pb-10 pl-4">
              <Image src="/icons/logo.svg" alt="logo" width={23} height={27} />
              <h1 className="text-24 font-extrabold  text-white-1 ml-2">Podcastr</h1>
            </SheetClose>
          </Link>

          <div className="flex h-auto flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 text-white-1">
                {sidebarLinks.map(({ route, label, imgURL }) => {
                  const isActive = pathname === route || pathname.startsWith(`${route}/`);

                  return <SheetClose asChild key={route}><Link href={route} className={cn("flex gap-3 items-center py-4 max-lg:px-4 justify-start", {
                    'bg-nav-focus border-r-4 border-orange-1': isActive
                  })}>
                    <Image src={imgURL} alt={label} width={24} height={24} />
                    <p>{label}</p>
                  </Link></SheetClose>
                })}
              </nav>
            </SheetClose>
          </div>

          <div className="text-white-1">
            <SignedIn>
              <Link href={`/profile/${user?.id}`} >
                <SheetClose className='flex gap-3 pb-12 py-8 px-4'>
                  <UserButton />
                  <div className="flex w-full items-center justify-between">
                    <h1 className="text-16 truncate font-semibold text-white-1">{user?.firstName} {user?.lastName}</h1>
                  </div>
                </SheetClose>

              </Link>

              <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
                <Button className='text-16 w-full bg-orange-1 font-extrabold' onClick={() => signOut(() => router.push('/'))}>
                  Logout
                </Button>
              </div>
            </SignedIn>

            <SignedOut>
              <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8 py-4">
                <Button className='text-16 w-full bg-orange-1 font-extrabold' asChild>
                  <Link href={"/sign-in"}>
                    Sign-In
                  </Link>
                </Button>
              </div>
            </SignedOut>

          </div>


        </SheetContent>
      </Sheet>
    </section>
  )
}

export default MobileNav