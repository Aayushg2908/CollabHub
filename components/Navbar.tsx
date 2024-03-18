"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import Image from "next/image";
import { useState } from "react";
import { Link } from "@nextui-org/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";

export const MainNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    {
      name: "Whiteboard",
      link: "/whiteboard",
    },
    {
      name: "TextEditor",
      link: "/texteditor",
    },
    {
      name: "CodeEditor",
      link: "/codeeditor",
    },
    {
      name: "Todo",
      link: "/todo",
    },
    {
      name: "Chat",
      link: "/chat",
    },
  ];

  return (
    <Navbar
      motionProps={{
        initial: { y: -100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 1 },
      }}
      onMenuOpenChange={setIsMenuOpen}
      shouldHideOnScroll
      isBordered
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" color="foreground" className="gap-x-2">
            <Image
              src="/logo.jpg"
              alt="logo"
              width={100}
              height={100}
              className="w-8 h-8 rounded-md"
            />
            <h1 className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-[#12c2e9] via-[#c471ed] to-[#f64f59] max-md:hidden">
              CollabHub
            </h1>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <SignedIn>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {menuItems.map((item, index) => (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.5, delay: index * 0.05 }}
              key={index}
            >
              <NavbarItem>
                <Link href={item.link} color="foreground">
                  {item.name}
                </Link>
              </NavbarItem>
            </motion.div>
          ))}
        </NavbarContent>
      </SignedIn>
      <NavbarContent justify="end">
        <SignedOut>
          <NavbarItem>
            <Button as={Link} href="/sign-in" color="primary">
              Login
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} href="/sign-up" color="primary">
              Sign Up
            </Button>
          </NavbarItem>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link className="w-full" href={item.link} size="lg">
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};
