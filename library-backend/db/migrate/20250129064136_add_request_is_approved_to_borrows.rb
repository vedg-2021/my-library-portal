class AddRequestIsApprovedToBorrows < ActiveRecord::Migration[8.0]
  def change
    add_column :borrows, :request_is_approved, :boolean, default: false
  end
end
