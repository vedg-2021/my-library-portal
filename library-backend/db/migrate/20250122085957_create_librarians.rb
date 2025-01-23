class CreateLibrarians < ActiveRecord::Migration[8.0]
  def change
    create_table :librarians do |t|
      t.string :name
      t.string :email
      t.string :phone
      t.string :address
      t.string :password_digest

      t.timestamps
    end
  end
end
