"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { FileUploadZone } from "./file-upload-zone"
import {
  Trash2,
  Settings,
  Copy,
  Eye,
  Download,
  Upload,
  CalendarIcon,
  Clock,
  Star,
  Hash,
  Phone,
  MapPin,
  Link,
  ImageIcon,
  Palette,
  BarChart3,
  Droplets as DragHandleDots2,
  MoreHorizontal,
  Type,
  Heading1,
  CheckSquare,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Plus,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { FileText } from "lucide-react"
import type { Block } from "@/types/blocks"

interface AdvancedFormField {
  id: string
  type:
    | "text"
    | "email"
    | "phone"
    | "number"
    | "textarea"
    | "select"
    | "multiselect"
    | "checkbox"
    | "radio"
    | "date"
    | "time"
    | "datetime"
    | "file"
    | "image"
    | "url"
    | "color"
    | "range"
    | "rating"
    | "signature"
    | "address"
    | "payment"
  label: string
  placeholder?: string
  required?: boolean
  description?: string
  options?: string[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    customMessage?: string
  }
  conditional?: {
    dependsOn: string
    value: any
  }
  styling?: {
    width: "full" | "half" | "third"
    backgroundColor?: string
    textColor?: string
  }
}

interface AdvancedFormBuilderProps {
  title: string
  fields: AdvancedFormField[]
  onUpdate: (fields: AdvancedFormField[], title: string) => void
  submissions?: any[]
  onAddBlock?: (type: Block["type"], index?: number) => void
}

export function AdvancedFormBuilder({
  title,
  fields,
  onUpdate,
  submissions = [],
  onAddBlock,
}: AdvancedFormBuilderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formTitle, setFormTitle] = useState(title)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [previewMode, setPreviewMode] = useState(false)
  const [draggedField, setDraggedField] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fieldTypes = [
    { type: "text", label: "Text Input", icon: FileText },
    { type: "email", label: "Email", icon: Hash },
    { type: "phone", label: "Phone", icon: Phone },
    { type: "number", label: "Number", icon: Hash },
    { type: "textarea", label: "Long Text", icon: FileText },
    { type: "select", label: "Dropdown", icon: Settings },
    { type: "multiselect", label: "Multi-Select", icon: Settings },
    { type: "checkbox", label: "Checkbox", icon: Settings },
    { type: "radio", label: "Radio Buttons", icon: Settings },
    { type: "date", label: "Date Picker", icon: CalendarIcon },
    { type: "time", label: "Time Picker", icon: Clock },
    { type: "datetime", label: "Date & Time", icon: CalendarIcon },
    { type: "file", label: "File Upload", icon: Upload },
    { type: "image", label: "Image Upload", icon: ImageIcon },
    { type: "url", label: "Website URL", icon: Link },
    { type: "color", label: "Color Picker", icon: Palette },
    { type: "range", label: "Range Slider", icon: BarChart3 },
    { type: "rating", label: "Star Rating", icon: Star },
    { type: "address", label: "Address", icon: MapPin },
  ]

  const blockTypes = [
    { type: "text", label: "Text", icon: Type },
    { type: "heading", label: "Heading", icon: Heading1 },
    { type: "todo", label: "To-do", icon: CheckSquare },
    { type: "bullet-list", label: "Bullet List", icon: List },
    { type: "numbered-list", label: "Numbered List", icon: ListOrdered },
    { type: "quote", label: "Quote", icon: Quote },
    { type: "code", label: "Code", icon: Code },
    { type: "divider", label: "Divider", icon: Minus },
    { type: "image", label: "Image", icon: ImageIcon },
  ]

  const addField = (type: AdvancedFormField["type"]) => {
    const newField: AdvancedFormField = {
      id: Date.now().toString(),
      type,
      label: `New ${type} field`,
      required: false,
      styling: { width: "full" },
    }

    if (type === "select" || type === "multiselect" || type === "radio") {
      newField.options = ["Option 1", "Option 2", "Option 3"]
    }

    onUpdate([...fields, newField], formTitle)
  }

  const updateField = (fieldId: string, updates: Partial<AdvancedFormField>) => {
    const updatedFields = fields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field))
    onUpdate(updatedFields, formTitle)
  }

  const deleteField = (fieldId: string) => {
    const updatedFields = fields.filter((field) => field.id !== fieldId)
    onUpdate(updatedFields, formTitle)
  }

  const duplicateField = (fieldId: string) => {
    const fieldToDuplicate = fields.find((field) => field.id === fieldId)
    if (fieldToDuplicate) {
      const duplicatedField = {
        ...fieldToDuplicate,
        id: Date.now().toString(),
        label: `${fieldToDuplicate.label} (Copy)`,
      }
      onUpdate([...fields, duplicatedField], formTitle)
    }
  }

  const moveField = (fromIndex: number, toIndex: number) => {
    const newFields = [...fields]
    const [movedField] = newFields.splice(fromIndex, 1)
    newFields.splice(toIndex, 0, movedField)
    onUpdate(newFields, formTitle)
  }

  const renderFieldPreview = (field: AdvancedFormField) => {
    const value = formData[field.id] || ""

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
      case "url":
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))}
            required={field.required}
            className={field.styling?.backgroundColor ? `bg-[${field.styling.backgroundColor}]` : ""}
          />
        )
      case "number":
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))}
            required={field.required}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        )
      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))}
            required={field.required}
            rows={4}
          />
        )
      case "select":
        return (
          <Select value={value} onValueChange={(val) => setFormData((prev) => ({ ...prev, [field.id]: val }))}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, idx) => (
                <SelectItem key={idx} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "multiselect":
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${idx}`}
                  checked={(value || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = value || []
                    const newValues = checked
                      ? [...currentValues, option]
                      : currentValues.filter((v: string) => v !== option)
                    setFormData((prev) => ({ ...prev, [field.id]: newValues }))
                  }}
                />
                <Label htmlFor={`${field.id}-${idx}`}>{option}</Label>
              </div>
            ))}
          </div>
        )
      case "radio":
        return (
          <RadioGroup value={value} onValueChange={(val) => setFormData((prev) => ({ ...prev, [field.id]: val }))}>
            {field.options?.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${idx}`} />
                <Label htmlFor={`${field.id}-${idx}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => setFormData((prev) => ({ ...prev, [field.id]: date?.toISOString() }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )
      case "color":
        return (
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={value || "#000000"}
              onChange={(e) => setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))}
              className="w-12 h-10 rounded border"
            />
            <Input
              value={value || "#000000"}
              onChange={(e) => setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))}
              placeholder="#000000"
            />
          </div>
        )
      case "range":
        return (
          <div className="space-y-2">
            <Slider
              value={[value || field.validation?.min || 0]}
              onValueChange={(vals) => setFormData((prev) => ({ ...prev, [field.id]: vals[0] }))}
              min={field.validation?.min || 0}
              max={field.validation?.max || 100}
              step={1}
            />
            <div className="text-center text-sm text-gray-500">Value: {value || field.validation?.min || 0}</div>
          </div>
        )
      case "rating":
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                variant="ghost"
                size="sm"
                className="p-0 h-8 w-8"
                onClick={() => setFormData((prev) => ({ ...prev, [field.id]: star }))}
              >
                <Star
                  className={cn("h-6 w-6", star <= (value || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300")}
                />
              </Button>
            ))}
          </div>
        )
      case "file":
      case "image":
        return (
          <FileUploadZone
            onFilesUploaded={(files) => setFormData((prev) => ({ ...prev, [field.id]: files }))}
            maxFiles={field.type === "image" ? 5 : 10}
            maxSize={5}
            acceptedTypes={field.type === "image" ? ["image/*"] : ["*/*"]}
          />
        )
      default:
        return <Input placeholder={field.placeholder} />
    }
  }

  const exportForm = () => {
    const formConfig = {
      title: formTitle,
      fields,
      submissions,
    }
    const blob = new Blob([JSON.stringify(formConfig, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${formTitle.toLowerCase().replace(/\s+/g, "-")}-form.json`
    a.click()
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex-1">
          {isEditing ? (
            <Input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              onBlur={() => onUpdate(fields, formTitle)}
              className="text-xl font-bold border-none p-0 h-auto focus-visible:ring-0"
            />
          ) : (
            <CardTitle className="text-xl cursor-pointer" onClick={() => setIsEditing(true)}>
              {formTitle}
            </CardTitle>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={exportForm}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isEditing && !previewMode ? (
          <div className="space-y-6">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <DragHandleDots2 className="h-4 w-4 text-gray-400 cursor-move" />
                        <Badge variant="outline">{field.type}</Badge>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => duplicateField(field.id)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteField(field.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {onAddBlock && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <div className="px-2 py-1.5 text-sm font-medium text-gray-700">Add Block</div>
                              <DropdownMenuSeparator />
                              {blockTypes.map(({ type, label, icon: Icon }) => (
                                <DropdownMenuItem
                                  key={type}
                                  onClick={() => onAddBlock(type as Block["type"], index)}
                                  className="flex items-center space-x-2"
                                >
                                  <Icon className="h-4 w-4" />
                                  <span>{label}</span>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Field Type
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <div className="grid grid-cols-1 gap-1 p-1">
                            {fieldTypes.map(({ type, label, icon: Icon }) => (
                              <DropdownMenuItem
                                key={type}
                                onClick={() => addField(type as AdvancedFormField["type"])}
                                className="flex items-center space-x-2"
                              >
                                <Icon className="h-4 w-4" />
                                <span className="text-sm">{label}</span>
                              </DropdownMenuItem>
                            ))}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Field Label</Label>
                        <Input value={field.label} onChange={(e) => updateField(field.id, { label: e.target.value })} />
                      </div>
                      <div>
                        <Label>Placeholder</Label>
                        <Input
                          value={field.placeholder || ""}
                          onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.required}
                          onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                        />
                        <Label>Required field</Label>
                      </div>
                    </div>

                    {(field.type === "select" || field.type === "multiselect" || field.type === "radio") && (
                      <div className="mt-4">
                        <Label>Options (one per line)</Label>
                        <Textarea
                          value={field.options?.join("\n") || ""}
                          onChange={(e) =>
                            updateField(field.id, {
                              options: e.target.value.split("\n").filter(Boolean),
                            })
                          }
                          rows={3}
                        />
                      </div>
                    )}

                    <div className="mt-4">
                      <Label>Field Width</Label>
                      <Select
                        value={field.styling?.width || "full"}
                        onValueChange={(value) =>
                          updateField(field.id, {
                            styling: { ...field.styling, width: value as "full" | "half" | "third" },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Full Width</SelectItem>
                          <SelectItem value="half">Half Width</SelectItem>
                          <SelectItem value="third">Third Width</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {fields.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-gray-500 mb-4">No fields yet. Add your first field to get started.</div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Field
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <div className="grid grid-cols-1 gap-1 p-1">
                        {fieldTypes.slice(0, 6).map(({ type, label, icon: Icon }) => (
                          <DropdownMenuItem
                            key={type}
                            onClick={() => addField(type as AdvancedFormField["type"])}
                            className="flex items-center space-x-2"
                          >
                            <Icon className="h-4 w-4" />
                            <span className="text-sm">{label}</span>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form className="space-y-6">
            <div className="grid gap-4">
              {fields.map((field) => {
                const widthClass =
                  field.styling?.width === "half"
                    ? "md:col-span-6"
                    : field.styling?.width === "third"
                      ? "md:col-span-4"
                      : "md:col-span-12"

                return (
                  <div key={field.id} className={cn("grid grid-cols-12 gap-4")}>
                    <div className={cn("col-span-12", widthClass)}>
                      <div className="space-y-2">
                        <Label htmlFor={field.id} className="flex items-center space-x-1">
                          <span>{field.label}</span>
                          {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        {field.description && <p className="text-sm text-gray-500">{field.description}</p>}
                        {renderFieldPreview(field)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {fields.length > 0 && (
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline">
                  Save Draft
                </Button>
                <Button type="submit">Submit Form</Button>
              </div>
            )}
          </form>
        )}

        {submissions.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Form Analytics</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Card className="p-4">
                <div className="text-2xl font-bold">{submissions.length}</div>
                <div className="text-sm text-gray-500">Total Submissions</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold">
                  {Math.round((submissions.length / (submissions.length + 10)) * 100)}%
                </div>
                <div className="text-sm text-gray-500">Completion Rate</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold">2.3m</div>
                <div className="text-sm text-gray-500">Avg. Time</div>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
