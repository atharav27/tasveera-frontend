"use client";

import * as React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../components/alert-dialog";
import { X } from "lucide-react";

interface LogoutDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    /** Optional custom illustration source - defaults to /logout.svg */
    illustrationSrc?: string;
    /** Dialog title - defaults to "Log Out?" */
    title?: string;
    /** Dialog description */
    description?: string;
    /** Confirm button text - defaults to "Log Out" */
    confirmText?: string;
    /** Cancel button text - defaults to "Go Back" */
    cancelText?: string;
}

export function LogoutDialog({
    open,
    onOpenChange,
    onConfirm,
    illustrationSrc = "/logout.svg",
    title = "Log Out?",
    description = "Your session will close and you'll return to the login screen.",
    confirmText = "Log Out",
    cancelText = "Go Back",
}: LogoutDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
                <div className="relative p-10 flex flex-col items-center text-center">
                    {/* Close Button */}
                    <button
                        onClick={() => onOpenChange(false)}
                        className="absolute right-6 top-6 p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-6 w-6 stroke-[1.5px]" />
                    </button>

                    {/* Illustration */}
                    <div className="mb-0 w-full max-w-[180px]">
                        <img
                            src={illustrationSrc}
                            alt="Logout Illustration"
                            className="w-full h-auto object-contain"
                        />
                    </div>

                    <AlertDialogHeader className="space-y-2 mb-10 mt-4">
                        <AlertDialogTitle className="text-2xl text-center w-full">
                            {title}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground leading-relaxed text-center">
                            {description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="flex flex-row gap-4 w-full sm:justify-center">
                        <AlertDialogAction
                            onClick={onConfirm}
                            variant={'destructive'}
                            size={'lg'}
                            className="px-8"
                        >
                            {confirmText}
                        </AlertDialogAction>
                        <AlertDialogCancel variant={'default'} size={'lg'} className="px-8">
                            {cancelText}
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}
