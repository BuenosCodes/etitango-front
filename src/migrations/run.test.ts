import React from 'react';
import { render, screen } from '@testing-library/react';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { MigrationManager } from './MigrationManager';
import { addUserRoles } from './001_add_user_roles';
import { mockFirestore } from '../__mocks__';

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/firestore', () => mockFirestore);

// Mock MigrationManager
jest.mock('./MigrationManager', () => ({
  MigrationManager: jest.fn().mockImplementation(() => ({
    migrate: jest.fn(),
    rollback: jest.fn(),
  })),
}));

describe('run.ts', () => {
  let originalProcessExit: (code?: number) => never;
  let originalConsoleLog: typeof console.log;
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    // Store original functions
    originalProcessExit = process.exit;
    originalConsoleLog = console.log;
    originalConsoleError = console.error;

    // Mock process.exit and console methods
    process.exit = jest.fn() as any;
    console.log = jest.fn();
    console.error = jest.fn();

    // Clear all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original functions
    process.exit = originalProcessExit;
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  describe('runMigrations', () => {
    it('should run migrations successfully', async () => {
      const mockMigrate = jest.fn().mockResolvedValue(undefined);
      (MigrationManager as jest.Mock).mockImplementation(() => ({
        migrate: mockMigrate,
        rollback: jest.fn(),
      }));

      // Import and run the migrations
      await require('./run').runMigrations();

      expect(mockMigrate).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Starting migrations...');
      expect(console.log).toHaveBeenCalledWith('Migrations completed successfully');
      expect(process.exit).not.toHaveBeenCalled();
    });

    it('should handle migration errors', async () => {
      const mockMigrate = jest.fn().mockRejectedValue(new Error('Migration failed'));
      (MigrationManager as jest.Mock).mockImplementation(() => ({
        migrate: mockMigrate,
        rollback: jest.fn(),
      }));

      // Import and run the migrations
      await require('./run').runMigrations();

      expect(mockMigrate).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Starting migrations...');
      expect(console.error).toHaveBeenCalledWith('Migration failed:', expect.any(Error));
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('rollbackMigrations', () => {
    it('should rollback migrations successfully', async () => {
      const mockRollback = jest.fn().mockResolvedValue(undefined);
      (MigrationManager as jest.Mock).mockImplementation(() => ({
        migrate: jest.fn(),
        rollback: mockRollback,
      }));

      // Import and run the rollback
      await require('./run').rollbackMigrations(2);

      expect(mockRollback).toHaveBeenCalledWith(2);
      expect(console.log).toHaveBeenCalledWith('Rolling back 2 migration(s)...');
      expect(console.log).toHaveBeenCalledWith('Rollback completed successfully');
      expect(process.exit).not.toHaveBeenCalled();
    });

    it('should handle rollback errors', async () => {
      const mockRollback = jest.fn().mockRejectedValue(new Error('Rollback failed'));
      (MigrationManager as jest.Mock).mockImplementation(() => ({
        migrate: jest.fn(),
        rollback: mockRollback,
      }));

      // Import and run the rollback
      await require('./run').rollbackMigrations(1);

      expect(mockRollback).toHaveBeenCalledWith(1);
      expect(console.log).toHaveBeenCalledWith('Rolling back 1 migration(s)...');
      expect(console.error).toHaveBeenCalledWith('Rollback failed:', expect.any(Error));
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should use default steps when not provided', async () => {
      const mockRollback = jest.fn().mockResolvedValue(undefined);
      (MigrationManager as jest.Mock).mockImplementation(() => ({
        migrate: jest.fn(),
        rollback: mockRollback,
      }));

      // Import and run the rollback
      await require('./run').rollbackMigrations();

      expect(mockRollback).toHaveBeenCalledWith(1);
      expect(console.log).toHaveBeenCalledWith('Rolling back 1 migration(s)...');
      expect(console.log).toHaveBeenCalledWith('Rollback completed successfully');
      expect(process.exit).not.toHaveBeenCalled();
    });
  });

  describe('command line interface', () => {
    let originalProcessArgv: string[];

    beforeEach(() => {
      originalProcessArgv = process.argv;
    });

    afterEach(() => {
      process.argv = originalProcessArgv;
    });

    it('should run migrations when no arguments provided', async () => {
      const mockMigrate = jest.fn().mockResolvedValue(undefined);
      (MigrationManager as jest.Mock).mockImplementation(() => ({
        migrate: mockMigrate,
        rollback: jest.fn(),
      }));

      process.argv = ['node', 'run.ts'];
      await require('./run');

      expect(mockMigrate).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Starting migrations...');
    });

    it('should run rollback when rollback argument provided', async () => {
      const mockRollback = jest.fn().mockResolvedValue(undefined);
      (MigrationManager as jest.Mock).mockImplementation(() => ({
        migrate: jest.fn(),
        rollback: mockRollback,
      }));

      process.argv = ['node', 'run.ts', 'rollback', '2'];
      await require('./run');

      expect(mockRollback).toHaveBeenCalledWith(2);
      expect(console.log).toHaveBeenCalledWith('Rolling back 2 migration(s)...');
    });

    it('should use default steps for rollback when not provided', async () => {
      const mockRollback = jest.fn().mockResolvedValue(undefined);
      (MigrationManager as jest.Mock).mockImplementation(() => ({
        migrate: jest.fn(),
        rollback: mockRollback,
      }));

      process.argv = ['node', 'run.ts', 'rollback'];
      await require('./run');

      expect(mockRollback).toHaveBeenCalledWith(1);
      expect(console.log).toHaveBeenCalledWith('Rolling back 1 migration(s)...');
    });
  });
}); 