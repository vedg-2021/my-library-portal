class AllowEmptyAddressInUsers < ActiveRecord::Migration[8.0]
  def change
    change_column_null :users, :address, true
  end
end
