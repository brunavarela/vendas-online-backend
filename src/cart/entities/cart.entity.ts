import { CartProductEntity } from "src/cart-product/entities/cartProduct.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'cart'})
export class CartEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'active', nullable: false })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Um carrinho pode ter vários produtos
  @OneToMany(() => CartProductEntity, (cartProduct) => cartProduct.cart)
  cartProduct?: CartProductEntity;
}