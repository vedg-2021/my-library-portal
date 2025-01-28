class AddDetailsToBooks < ActiveRecord::Migration[8.0]
  def change
    add_column :books, :current_quantity, :integer
    add_column :books, :total_quantity, :integer
    add_column :books, :is_deleted, :boolean, default: false
    add_column :books, :isbn, :string
    add_column :books, :price, :decimal, precision: 8, scale: 2
  end
end
