"use client"
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

  
export default function EditSpecialistDialog() {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Edit Data</Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Specialist Information</DialogTitle>
          </DialogHeader>
  
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quad name</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Arabic - English" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar-en">Arabic - English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
  
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue="MMMMMMM@GMAIL.COM" />
              </div>
  
              <div className="space-y-2">
                <Label>Choose the age group</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Adults" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adults">Adults</SelectItem>
                  </SelectContent>
                </Select>
              </div>
  
              <div className="space-y-2">
                <Label>Main Specialty</Label>
                <Input defaultValue="Arabic - English" />
              </div>
            </div>
  
            <div className="space-y-2">
              <Label>Write a Brief Professional Biography</Label>
              <Textarea
                className="min-h-[200px]"
                placeholder="Enter your professional biography..."
              />
            </div>
  
            <Button className="w-full">Edit Data</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  