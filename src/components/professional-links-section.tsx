"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Linkedin, Globe, Edit2, ExternalLink, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

interface ProfessionalLinksSectionProps {
  linkedinUrl?: string | null
  portfolioUrl?: string | null
  isEditing: boolean
  onEdit: () => void
  onSave: (data: { linkedinUrl?: string; portfolioUrl?: string }) => Promise<void>
  onCancel: () => void
}

export function ProfessionalLinksSection({
  linkedinUrl,
  portfolioUrl,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: ProfessionalLinksSectionProps) {
  const [editData, setEditData] = useState({
    linkedinUrl: linkedinUrl || "",
    portfolioUrl: portfolioUrl || "",
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    // Validate URLs if provided
    if (editData.linkedinUrl && editData.linkedinUrl.trim()) {
      try {
        new URL(editData.linkedinUrl)
      } catch {
        toast.error("Please enter a valid LinkedIn URL")
        return
      }
    }

    if (editData.portfolioUrl && editData.portfolioUrl.trim()) {
      try {
        new URL(editData.portfolioUrl)
      } catch {
        toast.error("Please enter a valid portfolio URL")
        return
      }
    }

    setIsSaving(true)
    try {
      await onSave({
        linkedinUrl: editData.linkedinUrl.trim() || undefined,
        portfolioUrl: editData.portfolioUrl.trim() || undefined,
      })
      toast.success("Professional links updated!")
    } catch (error) {
      toast.error("Failed to update links")
    } finally {
      setIsSaving(false)
    }
  }

  const hasNoLinks = !linkedinUrl && !portfolioUrl

  return (
    <Card className="border-border">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Professional Links</h3>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="text-[oklch(0.75_0.15_85)]"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        {!isEditing ? (
          <div className="space-y-4">
            {/* LinkedIn Link */}
            {linkedinUrl ? (
              <motion.a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-[oklch(0.75_0.15_85)] hover:bg-[oklch(0.22_0_0)]/50 transition-all group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-10 h-10 rounded-full bg-[#0077B5] flex items-center justify-center flex-shrink-0">
                  <Linkedin className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">LinkedIn Profile</p>
                  <p className="text-sm text-muted-foreground truncate">{linkedinUrl}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-[oklch(0.75_0.15_85)] transition-colors flex-shrink-0" />
              </motion.a>
            ) : null}

            {/* Portfolio Link */}
            {portfolioUrl ? (
              <motion.a
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-[oklch(0.75_0.15_85)] hover:bg-[oklch(0.22_0_0)]/50 transition-all group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-[oklch(0.12_0_0)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">Portfolio / Website</p>
                  <p className="text-sm text-muted-foreground truncate">{portfolioUrl}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-[oklch(0.75_0.15_85)] transition-colors flex-shrink-0" />
              </motion.a>
            ) : null}

            {/* Empty State */}
            {hasNoLinks && (
              <div className="text-center py-8 px-4 border-2 border-dashed border-border rounded-lg">
                <div className="flex justify-center gap-2 mb-3">
                  <Linkedin className="w-6 h-6 text-muted-foreground" />
                  <Globe className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Add your professional links to improve visibility
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={onEdit}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Add Links
                </Button>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* LinkedIn Input */}
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl" className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-[#0077B5]" />
                LinkedIn Profile URL
              </Label>
              <Input
                id="linkedinUrl"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                value={editData.linkedinUrl}
                onChange={(e) =>
                  setEditData({ ...editData, linkedinUrl: e.target.value })
                }
              />
            </div>

            {/* Portfolio Input */}
            <div className="space-y-2">
              <Label htmlFor="portfolioUrl" className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[oklch(0.75_0.15_85)]" />
                Portfolio / Website URL
              </Label>
              <Input
                id="portfolioUrl"
                type="url"
                placeholder="https://yourportfolio.com"
                value={editData.portfolioUrl}
                onChange={(e) =>
                  setEditData({ ...editData, portfolioUrl: e.target.value })
                }
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditData({
                    linkedinUrl: linkedinUrl || "",
                    portfolioUrl: portfolioUrl || "",
                  })
                  onCancel()
                }}
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)]"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
