class AddIsRejectedAndRemarkToBorrows < ActiveRecord::Migration[8.0]
  def change
    add_column :borrows, :is_rejected, :boolean, default: false
    add_column :borrows, :remark, :string
  end
end
