"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@corpora/ui";
import { FormInputField } from "@corpora/ui";
import { MediaType } from "../mock-data";
import { Upload, FileCode, CheckCircle2, AlertCircle } from "lucide-react";

interface UploadMediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: (data: any) => void;
}

export function UploadMediaDialog({
  open,
  onOpenChange,
  onUploadComplete,
}: UploadMediaDialogProps) {
  const [step, setStep] = React.useState<'CONFIG' | 'UPLOADING' | 'SUCCESS'>('CONFIG');
  const [file, setFile] = React.useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      type: 'PRODUCT_GALLERY' as MediaType,
      parentId: "",
      altText: "",
      sortOrder: 0
    },
  });

  const selectedType = watch("type");

  const getParentLabel = (type: MediaType) => {
    if (type.startsWith('PRODUCT')) return 'Product ID';
    if (type.startsWith('FRAME')) return 'Frame Design ID';
    if (type.startsWith('PHOTO')) return 'Photo Design ID';
    if (type === 'BANNER_IMAGE') return 'Banner ID';
    if (type === 'CATEGORY_IMAGE') return 'Category ID';
    return 'Parent ID';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Validation
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type)) {
          alert("Only JPEG, PNG and WEBP allowed.");
          return;
      }
      setFile(selectedFile);
    }
  };

  const onSubmit = async (values: any) => {
    if (!file) return;

    setStep('UPLOADING');
    
    try {
        // Step 1: Simulating Presign
        setUploadProgress(20);
        await new Promise(r => setTimeout(r, 800));
        
        // Step 2: Simulating S3 Upload
        setUploadProgress(60);
        await new Promise(r => setTimeout(r, 1200));

        // Step 3: Simulating Create Record
        setUploadProgress(90);
        await new Promise(r => setTimeout(r, 600));

        const newMedia = {
            ...values,
            url: URL.createObjectURL(file), // Mock URL
            createdAt: new Date().toISOString()
        };

        setUploadProgress(100);
        setStep('SUCCESS');
        onUploadComplete(newMedia);
    } catch (error) {
        console.error("Upload failed", error);
        setStep('CONFIG');
    }
  };

  const closeAndReset = () => {
      onOpenChange(false);
      setStep('CONFIG');
      setFile(null);
      setUploadProgress(0);
      reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
        <div className="bg-primary/5 px-6 py-8 border-b border-primary/10">
            <DialogHeader>
            <DialogTitle className="text-2xl font-black text-primary uppercase tracking-tighter italic">Asset Ingest</DialogTitle>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mt-1">Centralized Multi-Step Uplink</p>
            </DialogHeader>
        </div>

        <div className="p-8">
            {step === 'CONFIG' && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400">Media Context</Label>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-full h-12 rounded-2xl bg-slate-50 border-slate-100 shadow-none">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PRODUCT_GALLERY">Product Gallery</SelectItem>
                                            <SelectItem value="PRODUCT_THUMBNAIL">Product Thumbnail</SelectItem>
                                            <SelectItem value="FRAME_GALLERY">Frame Gallery</SelectItem>
                                            <SelectItem value="FRAME_PREVIEW">Frame Preview</SelectItem>
                                            <SelectItem value="PHOTO_TEMPLATE">Photo Template</SelectItem>
                                            <SelectItem value="BANNER_IMAGE">Banner</SelectItem>
                                            <SelectItem value="CATEGORY_IMAGE">Category</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <FormInputField
                            control={control}
                            name="parentId"
                            label={getParentLabel(selectedType)}
                            placeholder="ID-123"
                            className="bg-slate-50 border-slate-100 h-12 rounded-2xl"
                        />
                    </div>

                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative group cursor-pointer border-2 border-dashed rounded-3xl p-10 transition-all text-center flex flex-col items-center justify-center gap-3 ${file ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary hover:bg-primary/5'}`}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            onChange={handleFileChange}
                            accept="image/jpeg,image/png,image/webp"
                        />
                        {file ? (
                             <>
                                <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <FileCode className="h-7 w-7" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 truncate max-w-[300px]">{file.name}</p>
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to Uplink</p>
                                </div>
                             </>
                        ) : (
                            <>
                                <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-primary/20">
                                    <Upload className="h-7 w-7" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-slate-600">Drag or Click to Select</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">JPEG, PNG, WEBP • Max 5MB</p>
                                </div>
                            </>
                        )}
                    </div>

                    <FormInputField
                        control={control}
                        name="altText"
                        label="Descriptive Alt Text"
                        placeholder="Describe focus of image..."
                        className="bg-slate-50 border-slate-100 h-12 rounded-2xl shadow-none"
                    />

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={closeAndReset} className="flex-1 h-12 rounded-2xl">Abort</Button>
                        <Button type="submit" className="flex-1 h-12 rounded-2xl shadow-lg shadow-primary/20" disabled={!file}>Execute Upload</Button>
                    </div>
                </form>
            )}

            {step === 'UPLOADING' && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-8">
                     <div className="relative h-32 w-32 flex items-center justify-center">
                        <svg className="absolute inset-0 h-full w-full -rotate-90">
                            <circle cx="64" cy="64" r="60" fill="transparent" stroke="#f1f5f9" strokeWidth="8"/>
                            <circle cx="64" cy="64" r="60" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="377" strokeDashoffset={377 - (377 * uploadProgress / 100)} className="text-primary transition-all duration-500"/>
                        </svg>
                        <div className="text-2xl font-black text-slate-900">{uploadProgress}%</div>
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Uploading to Cloud</h4>
                        <p className="text-sm text-muted-foreground font-medium max-w-[280px]">
                            {uploadProgress < 30 ? "Negotiating presigned tunnel..." : uploadProgress < 80 ? "Streaming chunks to S3 buckets..." : "Finalizing metadata persistence..."}
                        </p>
                     </div>
                </div>
            )}

            {step === 'SUCCESS' && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-8">
                    <div className="h-24 w-24 rounded-full bg-green-500/10 border-4 border-green-500/20 flex items-center justify-center text-green-500 animate-in zoom-in duration-500">
                        <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <div className="space-y-2 px-10">
                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">System Ingest Complete</h4>
                        <p className="text-sm text-muted-foreground font-medium">Asset successfully mapped and synchronized across cloud infrastructure.</p>
                    </div>
                    <Button onClick={closeAndReset} className="w-full h-12 rounded-2xl shadow-lg shadow-primary/20">Acknowledge</Button>
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
