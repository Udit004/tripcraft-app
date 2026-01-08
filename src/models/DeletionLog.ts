import mongoose, { Schema, Document } from 'mongoose';

interface IDeletionLogDocument extends Document {
  userId: mongoose.Types.ObjectId;
  entityType: 'trip' | 'itineraryDay' | 'activity';
  entityId: string;
  data: any;
  relatedData?: any;
  deletedAt: Date;
  expiresAt: Date;
  createdAt: Date;
}

const deletionLogSchema = new Schema<IDeletionLogDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  entityType: {
    type: String,
    enum: ['trip', 'itineraryDay', 'activity'],
    required: true,
  },
  entityId: {
    type: String,
    required: true,
  },
  data: {
    type: Schema.Types.Mixed,
    required: true,
  },
  relatedData: {
    type: Schema.Types.Mixed,
  },
  deletedAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }, // Auto-delete after expiration
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const DeletionLog = mongoose.models.DeletionLog || mongoose.model<IDeletionLogDocument>('DeletionLog', deletionLogSchema);
export default DeletionLog;
