import connectDB from '@/lib/mongodb';
import DeletionLog from '@/models/DeletionLog';

export interface IDeletionRecord {
  userId: string;
  entityType: 'trip' | 'itineraryDay' | 'activity';
  entityId: string;
  data: any;
  relatedData?: any;
}

export async function logDeletion(record: IDeletionRecord) {
  try {
    await connectDB();
    
    const deletedAt = new Date();
    const expiresAt = new Date(deletedAt.getTime() + 10 * 1000); // 10 seconds window
    
    const deletionLog = await DeletionLog.create({
      ...record,
      deletedAt,
      expiresAt,
    });

    return deletionLog._id.toString();
  } catch (error) {
    console.error('Error logging deletion:', error);
    throw error;
  }
}

export async function recoverDeletion(deletionLogId: string, userId: string) {
  try {
    await connectDB();
    
    const deletionLog = await DeletionLog.findById(deletionLogId);
    
    if (!deletionLog) {
      throw new Error('Deletion log not found');
    }
    
    if (deletionLog.userId.toString() !== userId) {
      throw new Error('Unauthorized access');
    }
    
    if (new Date() > deletionLog.expiresAt) {
      throw new Error('Undo window expired');
    }
    
    return deletionLog;
  } catch (error) {
    console.error('Error recovering deletion:', error);
    throw error;
  }
}

export async function cleanupExpiredDeletions() {
  try {
    await connectDB();
    
    const now = new Date();
    const expiredLogs = await DeletionLog.find({ expiresAt: { $lte: now } });
    
    // Permanently delete the entities
    // This would be called by a scheduled job
    
    await DeletionLog.deleteMany({ expiresAt: { $lte: now } });
    
    return expiredLogs.length;
  } catch (error) {
    console.error('Error cleaning up expired deletions:', error);
    throw error;
  }
}
