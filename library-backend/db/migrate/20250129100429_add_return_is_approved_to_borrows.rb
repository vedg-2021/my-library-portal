class AddReturnIsApprovedToBorrows < ActiveRecord::Migration[8.0]
  def change
    add_column :borrows, :return_is_approved, :boolean, default: false
  end
end
