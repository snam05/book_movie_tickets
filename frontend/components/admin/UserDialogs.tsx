// Dialog components for user management

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, CreateUserData, UpdateUserData } from '@/lib/api/users';

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CreateUserData;
  onFormChange: (data: CreateUserData) => void;
  onSubmit: () => void;
}

export function CreateUserDialog({ open, onOpenChange, formData, onFormChange, onSubmit }: CreateUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo người dùng mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin để tạo tài khoản người dùng mới
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="create-email">Email *</Label>
              <Input
                id="create-email"
                type="email"
                value={formData.email}
                onChange={(e) => onFormChange({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password">Mật khẩu *</Label>
              <Input
                id="create-password"
                type="password"
                value={formData.password}
                onChange={(e) => onFormChange({ ...formData, password: e.target.value })}
                placeholder="Tối thiểu 8 ký tự"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-fullname">Họ và tên *</Label>
            <Input
              id="create-fullname"
              value={formData.full_name}
              onChange={(e) => onFormChange({ ...formData, full_name: e.target.value })}
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="create-cccd">Số CCCD *</Label>
              <Input
                id="create-cccd"
                value={formData.cccd_number}
                onChange={(e) => onFormChange({ ...formData, cccd_number: e.target.value })}
                placeholder="001234567890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-phone">Số điện thoại</Label>
              <Input
                id="create-phone"
                value={formData.phone_number}
                onChange={(e) => onFormChange({ ...formData, phone_number: e.target.value })}
                placeholder="0912345678"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="create-dob">Ngày sinh</Label>
              <Input
                id="create-dob"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => onFormChange({ ...formData, date_of_birth: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-gender">Giới tính</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value) => onFormChange({ ...formData, gender: value })}
              >
                <SelectTrigger id="create-gender">
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-role">Quyền</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value: 'user' | 'admin') => onFormChange({ ...formData, role: value })}
            >
              <SelectTrigger id="create-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onSubmit} className="bg-red-600 hover:bg-red-700">
            Tạo người dùng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  formData: UpdateUserData;
  onFormChange: (data: UpdateUserData) => void;
  onSubmit: () => void;
}

export function EditUserDialog({ open, onOpenChange, user, formData, onFormChange, onSubmit }: EditUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin người dùng</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin của người dùng {user?.full_name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email *</Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => onFormChange({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-fullname">Họ và tên *</Label>
            <Input
              id="edit-fullname"
              value={formData.full_name}
              onChange={(e) => onFormChange({ ...formData, full_name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-cccd">Số CCCD *</Label>
              <Input
                id="edit-cccd"
                value={formData.cccd_number}
                onChange={(e) => onFormChange({ ...formData, cccd_number: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Số điện thoại</Label>
              <Input
                id="edit-phone"
                value={formData.phone_number}
                onChange={(e) => onFormChange({ ...formData, phone_number: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-dob">Ngày sinh</Label>
              <Input
                id="edit-dob"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => onFormChange({ ...formData, date_of_birth: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-gender">Giới tính</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value) => onFormChange({ ...formData, gender: value })}
              >
                <SelectTrigger id="edit-gender">
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onSubmit} className="bg-red-600 hover:bg-red-700">
            Cập nhật
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface SetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  newPassword: string;
  confirmPassword: string;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: () => void;
}

export function SetPasswordDialog({ 
  open, 
  onOpenChange, 
  user, 
  newPassword, 
  confirmPassword,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit 
}: SetPasswordDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đặt mật khẩu mới</DialogTitle>
          <DialogDescription>
            Đặt mật khẩu mới cho người dùng {user?.full_name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">Mật khẩu mới</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => onNewPasswordChange(e.target.value)}
              placeholder="Tối thiểu 8 ký tự"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              placeholder="Nhập lại mật khẩu"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onSubmit} className="bg-red-600 hover:bg-red-700">
            Đặt mật khẩu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onConfirm: () => void;
}

export function DeleteUserDialog({ open, onOpenChange, user, onConfirm }: DeleteUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa người dùng <strong>{user?.full_name}</strong> ({user?.email})?
            <br />
            <span className="text-red-600">Hành động này không thể hoàn tác!</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onConfirm} variant="destructive">
            Xóa người dùng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ToggleRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onConfirm: () => void;
}

export function ToggleRoleDialog({ open, onOpenChange, user, onConfirm }: ToggleRoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thay đổi quyền người dùng</DialogTitle>
          <DialogDescription>
            Bạn có muốn thay đổi quyền của <strong>{user?.full_name}</strong> từ{' '}
            <strong>{user?.role === 'admin' ? 'Admin' : 'User'}</strong> sang{' '}
            <strong>{user?.role === 'admin' ? 'User' : 'Admin'}</strong>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onConfirm} className="bg-amber-500 hover:bg-amber-600">
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface MessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  type?: 'success' | 'error';
}

export function MessageDialog({ open, onOpenChange, title, message, type = 'success' }: MessageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={type === 'error' ? 'text-red-600' : 'text-green-600'}>
            {title}
          </DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            onClick={() => onOpenChange(false)} 
            className={type === 'error' ? '' : 'bg-green-600 hover:bg-green-700'}
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
